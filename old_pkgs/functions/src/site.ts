import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import Responder from './lib/Responder';
import router from './site/router';

import log from './lib/log';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  log({ event, context });
  router(event, new Responder(callback));
};

export { handler };
