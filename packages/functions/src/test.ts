import { Handler, Context, APIGatewayEvent } from 'aws-lambda';

const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  return {
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
  };
};

export { handler };
