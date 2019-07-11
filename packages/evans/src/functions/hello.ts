import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import mongoose from 'mongoose';

// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  console.log('queryStringParameters', event.queryStringParameters);
  callback(null, {
    // return null to show no errors
    statusCode: 200, // http status code
    body: JSON.stringify({
      msg: 'Hello, Typescript, yo! ' + Math.round(Math.random() * 10) + typeof mongoose,
    }),
  });
};

export { handler };
