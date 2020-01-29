import '@friends-library/env/load';
import { APIGatewayEvent } from 'aws-lambda';
import env from '@friends-library/env';
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
  const { CLOUD_STORAGE_BUCKET_URL } = env.require('CLOUD_STORAGE_BUCKET_URL');
  const cloudPath = `${editionPath}/${filename}`;
  let redirUri = `${CLOUD_STORAGE_BUCKET_URL}/${cloudPath}`;

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
    };
    await create(download);
    log('Download added to db:', { download });
  } catch (error) {
    log.error('error adding download to db', { error });
  }

  sendSlack(ua, referrer, cloudPath);
}

export default logDownload;

function sendSlack(ua: useragent.UserAgent, referrer: string, cloudPath: string): void {
  const device = [
    ua.platform,
    ua.os,
    ua.browser,
    ua.isMobile ? 'mobile' : 'non-mobile',
  ].join(' / ');

  const from = referrer ? ` from url: ${referrer}` : '';
  const { SLACK_DOWNLOADS_CHANNEL } = env.require('SLACK_DOWNLOADS_CHANNEL');

  slack.send(
    `Download: \`${cloudPath}\`, device: \`${device}\`${from}`,
    SLACK_DOWNLOADS_CHANNEL,
  );
}
