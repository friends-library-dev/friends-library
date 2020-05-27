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
import { create as createDownload, Download } from '../lib/download';
import Responder from '../lib/Responder';
import log from '../lib/log';

async function logDownload(
  { path, headers = {} }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const referrer = headers.referer || '';
  const pathParts = path.replace(/.*\/log\/download\//, '').split('/');
  const docId = pathParts.shift() || '';
  const filename = pathParts.pop() || '';
  const format = (pathParts.pop() || '') as DownloadFormat;
  const editionPath = pathParts.join('/');
  const editionType = (editionPath || '').split('/').pop() as EditionType;
  const cloudPath = `${editionPath}/${filename}`;
  let redirUri = `${env('CLOUD_STORAGE_BUCKET_URL')}/${cloudPath}`;

  if (!['original', 'modernized', 'updated'].includes(editionType)) {
    respond.clientError(`Bad editionType to /log/download: ${editionType}`);
    return;
  }

  if (!DOWNLOAD_FORMATS.includes(format)) {
    respond.clientError(`Unknown download format: ${format}`);
    return;
  }

  let audioQuality: AudioQuality | undefined;
  let audioPartNumber: number | undefined;

  if (format === 'podcast') {
    audioQuality = filename.endsWith('--lq.rss') ? 'LQ' : 'HQ';
    // @TODO this is duplicated in Audio.podcastRelFilepath() :(
    redirUri = `${editionPath.replace(/^(en|es)\//, '/')}/${
      audioQuality === 'LQ' ? 'lq/' : ''
    }podcast.rss`;
  }

  if (format === 'mp3') {
    audioQuality = filename.endsWith('--lq.mp3') ? 'LQ' : 'HQ';
    audioPartNumber = 1;
    filename.replace(/--pt(\d+)(--lq)?\.mp3$/, (_, num) => {
      audioPartNumber = Number(num);
      return '';
    });
  }

  if (format === 'mp3-zip' || format === 'm4b') {
    audioQuality = filename.match(/--lq\.(zip|m4b)$/) ? 'LQ' : 'HQ';
  }

  respond.redirect(redirUri);

  const userAgent = headers['user-agent'] || '';
  const parsedUserAgent = useragent.parse(userAgent);
  if (parsedUserAgent.isBot || isbot(userAgent)) {
    log.info(`Bot download: \`${userAgent}\``);
    return;
  }

  let location: Record<string, string | number> = {};
  if (headers['client-ip']) {
    try {
      const ipRes = await fetch(`https://ipapi.co/${headers['client-ip']}/json/`);
      const json = await ipRes.json();
      if (typeof json === 'object') {
        location = {
          ip: json.ip,
          city: json.city,
          region: json.region,
          postalCode: json.postal,
          country: json.country_name,
          latitude: json.latitude,
          longitude: json.longitude,
        };
      }
    } catch {
      // ¯\_(ツ)_/¯
    }
  }

  const download: Download = {
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

  const [error] = await createDownload(download);
  if (error) {
    log.error('error adding download to db', { error });
  } else {
    log.debug('Download added to db:', { download });
  }

  sendSlack(parsedUserAgent, referrer, cloudPath, location);
}

export default logDownload;

function sendSlack(
  ua: useragent.UserAgent,
  referrer: string,
  cloudPath: string,
  location: Record<string, string | number>,
): void {
  const device = [ua.platform, ua.os, ua.browser, ua.isMobile ? 'mobile' : 'non-mobile']
    .filter(part => part !== 'unknown')
    .join(' / ');

  const from = referrer ? `, from url: ${referrer}` : '';

  let where = '';
  if (location.latitude) {
    const mapUrl = `https://www.google.com/maps/@${location.latitude},${location.longitude},14z`;
    const parts = [location.city, location.region, location.postalCode, location.country]
      .filter(Boolean)
      .join(' / ');
    where = `, location: \`${parts}\` ${mapUrl}`;
  }

  log.download(`Download: \`${cloudPath}\`, device: \`${device}\`${from}${where}`);
}
