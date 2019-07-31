import { APIGatewayEvent, Handler, Context } from 'aws-lambda';

export async function invokeCb(
  handler: Handler,
  event: Partial<APIGatewayEvent>,
): Promise<{
  err: Error | null;
  res: {
    statusCode: number;
    body?: string;
  };
  json: Record<string, any>;
}> {
  const cb = jest.fn();
  await handler(<APIGatewayEvent>event, <Context>{}, cb);
  const [err, res] = cb.mock.calls[0];
  let json: Record<string, any> = {};
  try {
    if (res.body && JSON.parse(res.body)) {
      json = JSON.parse(res.body);
    }
  } catch {}
  return { err, res, json };
}
