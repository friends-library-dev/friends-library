import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import Responder from './lib/Responder';
import router from './site/router';
import log from './lib/log';
import env from './lib/env';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  // @ts-ignore
  env.setContext(context);
  router(event, new Responder(callback));
  log.debug('*/site fn invocation*', {
    event: {
      path: event.path,
      httpMethod: event.httpMethod,
      queryStringParameters: event.queryStringParameters,
      body: readableBody(event.body),
      headers: {
        origin: event.headers?.origin,
        referer: event.headers?.referer,
        'user-agent': event.headers?.['user-agent'],
      },
    },
  });
};

export { handler };

function readableBody(body: any): any {
  if (typeof body === 'object') {
    return body;
  }

  try {
    var obj = JSON.parse(body || '');
  } catch (err) {
    return body;
  }

  return typeof obj === 'object' ? obj : body;
}
