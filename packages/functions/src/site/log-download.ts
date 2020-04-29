import '@friends-library/env/load';
import fetch from 'node-fetch';
import { APIGatewayEvent } from 'aws-lambda';
import env from '../lib/env';
import { EditionType, AudioQuality } from '@friends-library/types';
import * as slack from '@friends-library/slack';
import useragent from 'express-useragent';
import { create, format as formats, Format } from '../lib/Download';
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
  const format = (pathParts.pop() || '') as Format;
  const editionPath = pathParts.join('/');
  const editionType = (editionPath || '').split('/').pop() as EditionType;
  const cloudPath = `${editionPath}/${filename}`;
  let redirUri = `${env('CLOUD_STORAGE_BUCKET_URL')}/${cloudPath}`;

  if (!['original', 'modernized', 'updated'].includes(editionType)) {
    respond.clientError(`Bad editionType to /log/download: ${editionType}`);
    return;
  }

  if (!formats.includes(format)) {
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

  const ua = useragent.parse(headers['user-agent'] || '');
  if (ua.isBot) {
    log('Bot, bailing early');
    return;
  }

  let location: null | Record<string, string | number> = null;
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

  try {
    const download = {
      document_id: docId,
      edition: editionType,
      format,
      audio_quality: audioQuality,
      audio_part_number: audioPartNumber,
      is_mobile: ua.isMobile,
      os: ua.os,
      browser: ua.browser,
      platform: ua.platform,
      referrer,
      ...(location ? { location } : {}),
    };
    await create(download);
    log('Download added to db:', { download });
  } catch (error) {
    log.error('error adding download to db', { error });
  }

  sendSlack(ua, referrer, cloudPath, location);
}

export default logDownload;

function sendSlack(
  ua: useragent.UserAgent,
  referrer: string,
  cloudPath: string,
  location: null | Record<string, string | number>,
): void {
  const device = [ua.platform, ua.os, ua.browser, ua.isMobile ? 'mobile' : 'non-mobile']
    .filter(part => part !== 'unknown')
    .join(' / ');

  const from = referrer ? `, from url: ${referrer}` : '';

  let where = '';
  if (location) {
    const mapUrl = `https://www.google.com/maps/@${location.latitude},${location.longitude},14z`;
    const parts = [location.city, location.region, location.postalCode, location.country]
      .filter(Boolean)
      .join(' / ');
    where = `, location: \`${parts}\` ${mapUrl}`;
  }

  slack.send(
    `Download: \`${cloudPath}\`, device: \`${device}\`${from}${where}`,
    env('SLACK_DOWNLOADS_CHANNEL'),
  );
}
