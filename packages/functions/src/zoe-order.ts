import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';

const handler: Handler = (
  { httpMethod }: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(httpMethod);
  if (!['OPTIONS', 'POST'].includes(httpMethod)) {
    callback(null, { statusCode: 400 });
    return;
  }

  const isDev = process.env.NODE_ENV === 'development';
  const allowedOrigin = isDev ? '*' : 'http://zoecostarica.com';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': '*',
  };

  if (httpMethod === 'OPTIONS') {
    callback(null, { statusCode: 204, headers });
    return;
  }

  // handle the order here

  callback(null, {
    statusCode: 201,
    body: 'Made the order! ¯\\_(ツ)_/¯',
    headers,
  });
};

export { handler };
