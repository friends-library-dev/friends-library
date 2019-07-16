import '@friends-library/client/load-env';
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { requireEnv } from '@friends-library/types';
import { slack } from '@friends-library/client';
import useragent from 'express-useragent';
import Download from '../Download';
import connect from '../db';

const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { path, queryStringParameters: query } = event;
  const isDev = process.env.NODE_ENV === 'development';
  const referrer = query ? query.referrer : '';
  const pathParts = path.replace(/.*\/download\/web\//, '').split('/');
  const docId = pathParts.shift();
  const filename = pathParts.pop();
  const format = pathParts.pop();
  const editionPath = pathParts.join('/');
  const editionType = (editionPath || '').split('/').pop();
  const { CLOUD_STORAGE_BUCKET_URL } = requireEnv('CLOUD_STORAGE_BUCKET_URL');
  const cloudUri = `${CLOUD_STORAGE_BUCKET_URL}/${editionPath}/${filename}`;

  respond(cloudUri, callback, isDev);

  const ua = useragent.parse(event.headers['user-agent'] || '');
  if (ua.isBot) {
    return;
  }

  await connect();
  await Download.create({
    document_id: docId,
    edition: editionType,
    format,
    is_mobile: ua.isMobile,
    os: ua.os,
    browser: ua.browser,
    platform: ua.platform,
    referrer,
  });

  if (!isDev) {
    sendSlack(ua, referrer, editionPath);
  }
};

export default handler;

function respond(cloudUri: string, callback: Callback, isDev: boolean): void {
  if (!isDev) {
    callback(null, {
      statusCode: 302,
      headers: { location: cloudUri },
    });
    return;
  }

  callback(null, {
    statusCode: 200,
    headers: { contentType: 'text/html' },
    body: `Redirect to:<br /><br /><a href="${cloudUri}"/>${cloudUri}</a>`,
  });
}

function sendSlack(ua: useragent.UserAgent, referrer: string, path: string): void {
  const device = [
    ua.platform,
    ua.os,
    ua.browser,
    ua.isMobile ? 'mobile' : 'non-mobile',
  ].join(' / ');

  const from = referrer ? ` from url: ${referrer}` : '';
  const { SLACK_DOWNLOADS_CHANNEL } = requireEnv('SLACK_DOWNLOADS_CHANNEL');

  slack.send(
    `File downloaded: \`${path}\`, device: \`${device}\`${from}`,
    SLACK_DOWNLOADS_CHANNEL,
  );
}
