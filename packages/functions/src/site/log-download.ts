import '@friends-library/env/load';
import fetch from 'node-fetch';
import { APIGatewayEvent } from 'aws-lambda';
import env from '../lib/env';
import {
  EditionType,
  AudioQuality,
  DownloadFormat,
  DOWNLOAD_FORMATS,
} from '@friends-library/types';
import useragent from 'express-useragent';
import isbot from 'isbot';
import { Client as DbClient, Db } from '@friends-library/db';
import { log } from '@friends-library/slack';
import Responder from '../lib/Responder';

async function logDownload(
  { path, headers = {} }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const referrer = headers.referer || ``;
  const pathParts = path.replace(/.*\/log\/download\//, ``).split(`/`);
  const docId = pathParts.shift() || ``;
  const filename = pathParts.pop() || ``;
  const format = (pathParts.pop() || ``) as DownloadFormat;
  const editionPath = pathParts.join(`/`);
  const editionType = (editionPath || ``).split(`/`).pop() as EditionType;
  const cloudPath = `${editionPath}/${filename}`;
  let redirUri = `${env(`CLOUD_STORAGE_BUCKET_URL`)}/${cloudPath}`;

  if (![`original`, `modernized`, `updated`].includes(editionType)) {
    respond.clientError(`Bad editionType to /log/download: ${editionType}`);
    return;
  }

  if (!DOWNLOAD_FORMATS.includes(format)) {
    respond.clientError(`Unknown download format: ${format}`);
    return;
  }

  let audioQuality: AudioQuality | undefined;
  let audioPartNumber: number | undefined;

  if (format === `podcast`) {
    audioQuality = filename.endsWith(`--lq.rss`) ? `LQ` : `HQ`;
    // @TODO this is duplicated in Audio.podcastRelFilepath() :(
    redirUri = `${editionPath.replace(/^(en|es)\//, `/`)}/${
      audioQuality === `LQ` ? `lq/` : ``
    }podcast.rss`;
  }

  if (format === `mp3`) {
    audioQuality = filename.endsWith(`--lq.mp3`) ? `LQ` : `HQ`;
    audioPartNumber = 1;
    filename.replace(/--pt(\d+)(--lq)?\.mp3$/, (_, num) => {
      audioPartNumber = Number(num);
      return ``;
    });
  }

  if (format === `mp3-zip` || format === `m4b`) {
    audioQuality = filename.match(/--lq\.(zip|m4b)$/) ? `LQ` : `HQ`;
  }

  respond.redirect(redirUri);

  const userAgent = headers[`user-agent`] || ``;
  const parsedUserAgent = useragent.parse(userAgent);
  if (parsedUserAgent.isBot || isbot(userAgent)) {
    log.debug(`Bot download: \`${userAgent}\``);
    return;
  }

  let location: Record<string, string | number | null> = {};
  if (headers[`client-ip`]) {
    try {
      const ipRes = await fetch(`https://ipapi.co/${headers[`client-ip`]}/json/`);
      const json = await ipRes.json();
      if (typeof json === `object`) {
        location = {
          ip: nullableLocationProp(`string`, json.ip),
          city: nullableLocationProp(`string`, json.city),
          region: nullableLocationProp(`string`, json.region),
          country: nullableLocationProp(`string`, json.country_name),
          postalCode: nullableLocationProp(`string`, json.postal),
          latitude: nullableLocationProp(`number`, json.latitude),
          longitude: nullableLocationProp(`number`, json.longitude),
        };
        if (!location.ip) {
          log.debug(`Unexpected location api json response`, { json, headers });
        }
      }
    } catch (err) {
      log.debug(`Error retrieving location data`, { error: err, userAgent });
    }
  }

  const download: Db.Download = {
    documentId: docId,
    edition: editionType,
    format,
    audioQuality,
    audioPartNumber,
    isMobile: parsedUserAgent.isMobile,
    os: parsedUserAgent.os,
    browser: parsedUserAgent.browser,
    platform: parsedUserAgent.platform,
    referrer,
    ...location,
    created: new Date().toISOString(),
    userAgent,
  };

  if (download.browser === `AirPodcasts` && location.city === `Pensacola`) {
    return; // don't record or slack strange repetative requests from CB
  }

  const db = new DbClient(env(`FAUNA_SERVER_SECRET`));
  const [error] = await db.downloads.create(download);
  if (error) {
    log.error(`error adding download to db`, { error });
  } else {
    log.debug(`Download added to db:`, { download });
  }

  if (cloudPath.endsWith(`podcast.rss`)) {
    log.debug(`RSS download added: ${cloudPath}`, { location });
  } else {
    sendSlack(parsedUserAgent, referrer, cloudPath, location);
  }
}

export default logDownload;

function sendSlack(
  ua: useragent.UserAgent,
  referrer: string,
  cloudPath: string,
  location: Record<string, string | number | null>,
): void {
  const device = [ua.platform, ua.os, ua.browser, ua.isMobile ? `mobile` : `non-mobile`]
    .filter(part => part !== `unknown`)
    .join(` / `);

  const from = referrer ? `, from url: \`${referrer}\`` : ``;

  let where = ``;
  if (location.city) {
    const parts = [location.city, location.region, location.postalCode, location.country]
      .filter(Boolean)
      .join(` / `);
    const mapUrl = location.latitude
      ? ` https://www.google.com/maps/@${location.latitude},${location.longitude},14z`
      : ``;
    where = `, location: \`${parts}\`${mapUrl}`;
  }

  log.download(`Download: \`${cloudPath}\`, device: \`${device}\`${from}${where}`);
}

function nullableLocationProp(
  type: 'string' | 'number',
  value: any,
): string | number | null {
  if (typeof value !== `string` && typeof value !== `number`) {
    return null;
  }

  if (typeof value !== type) {
    return null;
  }

  // some IPs are restricted with a `"Sign up to access"` value
  if (typeof value === `string` && value.match(/sign up/i)) {
    return null;
  }

  return value;
}
