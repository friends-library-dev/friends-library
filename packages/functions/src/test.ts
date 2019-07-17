import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
<pre>
EVENT:
----------------------------------
${JSON.stringify(event, null, 2)}

CONTEXT:
----------------------------------
${JSON.stringify(context, null, 2)}
</pre>
    `,
  });
};

export { handler };
