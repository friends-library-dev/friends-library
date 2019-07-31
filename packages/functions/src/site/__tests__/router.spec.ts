import router from '../router';
import { invokeCb } from './invoke';

describe('site fn', () => {
  it('returns 200 from `wakeup` request', async () => {
    const event = { path: '/.netlify/functions/site/wakeup' };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 204 });
    expect(err).toBeNull();
  });

  it('returns 404 from unknown path', async () => {
    const event = { path: '/.netlify/functions/site/bad/path' };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 404, body: 'Not Found' });
    expect(err).toBeNull();
  });

  it('returns redirect from `web/download` path', async () => {
    const event = {
      path:
        '/site/download/web/fake-id/en/george-fox/journal/updated/pdf-web/Journal--updated.pdf',
    };
    const { err, res } = await invokeCb(router, event);
    expect(err).toBeNull();
    expect(res.body).toContain(
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
    );
  });

  test('`web/download` path works prefixed with `.netlify/functions', async () => {
    const event = {
      path:
        '/.netlify/functions/site/download/web/fake-id/en/george-fox/journal/updated/pdf-web/Journal--updated.pdf',
    };
    const { res } = await invokeCb(router, event);
    expect(res.body).toContain(
      '/cloud/bucket/en/george-fox/journal/updated/Journal--updated.pdf',
    );
  });
});
