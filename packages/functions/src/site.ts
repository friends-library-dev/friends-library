import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import webDownloadHandler from './site/web-download-handler';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  console.log('function build by: netlify-lambda 👍');
  process.env.NODE_ENV !== 'development' && console.log({ event, context });

  if (event.path.match(/\/download\/web/)) {
    webDownloadHandler(event, context, callback);
    return;
  }

  callback(null, {
    statusCode: 404,
    body: 'NOT FOUND ¯\\_(ツ)_/¯',
  });
};

export { handler };
