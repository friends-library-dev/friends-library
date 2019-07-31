import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import webDownloadHandler from './site/web-download';
import paymentAuthorizationHandler from './site/payment-authorize';

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
      callback(null, { statusCode: 204 });
      return;
    case 'payment-authorize':
      paymentAuthorizationHandler(event, context, callback);
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
