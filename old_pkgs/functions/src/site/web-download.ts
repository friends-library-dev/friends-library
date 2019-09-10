import '@friends-library/client/load-env';
import { APIGatewayEvent } from 'aws-lambda';
import { requireEnv } from '@friends-library/types';
import { slack } from '@friends-library/client';
import useragent from 'express-useragent';
import mongoose from 'mongoose';
import Download from '../lib/Download';
import connect from '../lib/db';
import Responder from '../lib/Responder';
import log from '../lib/log';

export async function webDownload(
  { path, headers = {} }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';
  const referrer = headers.referer || '';
  const pathParts = path.replace(/.*\/download\/web\//, '').split('/');
  const docId = pathParts.shift();
  const filename = pathParts.pop();
  const format = pathParts.pop() || '';
  const editionPath = pathParts.join('/');
  const editionType = (editionPath || '').split('/').pop();
  const { CLOUD_STORAGE_BUCKET_URL } = requireEnv('CLOUD_STORAGE_BUCKET_URL');
  const cloudUri = `${CLOUD_STORAGE_BUCKET_URL}/${editionPath}/${filename}`;

  if (!isDev) {
    respond.redirect(cloudUri);
  } else {
    respond.text(`Redir to: ${cloudUri}`);
  }

  const ua = useragent.parse(headers['user-agent'] || '');
  if (ua.isBot) {
    log('Bot, bailing early');
    return;
  }

  try {
    const db = await connect();
    const download = await Download.create({
      document_id: docId,
      edition: editionType,
      format,
      is_mobile: ua.isMobile,
      os: ua.os,
      browser: ua.browser,
      platform: ua.platform,
      referrer,
    });
    await db.close();
    await mongoose.disconnect();
    log('Download added to db:', download);
  } catch (error) {
    log.error(error);
  }

  if (isDev) {
    return;
  }

  try {
    sendSlack(ua, referrer, editionPath, format);
  } catch (error) {
    log.error(error);
  }
}

export default webDownload;

function sendSlack(
  ua: useragent.UserAgent,
  referrer: string,
  path: string,
  format: string,
): void {
  const device = [
    ua.platform,
    ua.os,
    ua.browser,
    ua.isMobile ? 'mobile' : 'non-mobile',
  ].join(' / ');

  const from = referrer ? ` from url: ${referrer}` : '';
  const { SLACK_DOWNLOADS_CHANNEL } = requireEnv('SLACK_DOWNLOADS_CHANNEL');

  slack.send(
    `File downloaded: \`${path}/${format}\`, device: \`${device}\`${from}`,
    SLACK_DOWNLOADS_CHANNEL,
  );
}
