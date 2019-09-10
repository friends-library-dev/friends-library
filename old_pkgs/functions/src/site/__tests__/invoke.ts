import { APIGatewayEvent } from 'aws-lambda';
import Responder from '../../lib/Responder';

export async function invokeCb(
  handler: (event: APIGatewayEvent, responder: Responder) => Promise<void>,
  event: Partial<APIGatewayEvent>,
): Promise<{
  err: Error | null;
  res: {
    statusCode: number;
    body?: string;
  };
  json: Record<string, any>;
}> {
  event.httpMethod = event.httpMethod || 'GET';
  const cb = jest.fn();
  const respond = new Responder(cb);
  await handler(<APIGatewayEvent>event, respond);
  const [err, res] = cb.mock.calls[0];
  let json: Record<string, any> = {};
  try {
    if (res.body && JSON.parse(res.body)) {
      json = JSON.parse(res.body);
    }
  } catch {}
  return { err, res, json };
}
