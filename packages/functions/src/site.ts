import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import webDownloadHandler from './site/web-download-handler';
import log from './log';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  log({ event, context });

  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, '');
  switch (path) {
    case 'wakeup':
      callback(null, { statusCode: 200, body: '👍' });
      return;
  }

  if (path.startsWith('download/web/')) {
    webDownloadHandler(event, context, callback);
    return;
  }

  callback(null, {
    statusCode: 404,
    body: 'Not Found',
  });
};

export { handler };
