import { handler } from '../../site';
import { APIGatewayEvent, Handler, Context } from 'aws-lambda';

describe('site fn', () => {
  it('returns 200 from `wakeup` request', async () => {
    const event = { path: '/.netlify/functions/site/wakeup' };
    const { err, res } = await invoke(handler, event);
    expect(res).toMatchObject({ statusCode: 200, body: '👍' });
    expect(err).toBeNull();
  });

  it('returns 404 from unknown path', async () => {
    const event = { path: '/.netlify/functions/site/bad/path' };
    const { err, res } = await invoke(handler, event);
    expect(res).toMatchObject({ statusCode: 404, body: 'Not Found' });
    expect(err).toBeNull();
  });

  it('returns redirect from `web/download` path', async () => {
    const event = {
      path:
        '/site/download/web/fake-id/en/george-fox/journal/updated/pdf-web/Journal--updated.pdf',
    };
    const { err, res } = await invoke(handler, event);
    expect(err).toBeNull();
    expect(res).toMatchObject({
      statusCode: 302,
      headers: {
        location: '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
      },
    });
  });

  test('`web/download` path works prefixed with `.netlify/functions', async () => {
    const event = {
      path:
        '/.netlify/functions/site/download/web/fake-id/en/george-fox/journal/updated/pdf-web/Journal--updated.pdf',
    };
    const { res } = await invoke(handler, event);
    expect(res.statusCode).toBe(302);
  });
});

async function invoke(
  handler: Handler,
  event: Partial<APIGatewayEvent>,
): Promise<{
  err: Error | null;
  res: { statusCode: number; body?: string };
}> {
  const cb = jest.fn();
  await handler(<APIGatewayEvent>event, <Context>{}, cb);
  const [err, res] = cb.mock.calls[0];
  return { err, res };
}
