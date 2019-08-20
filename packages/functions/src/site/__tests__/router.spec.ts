import router from '../router';
import { invokeCb } from './invoke';
import printJobStatus from '../print-job-status';
import sendOrderConfirmationEmail from '../order-send-confirmation-email';

jest.mock('../print-job-status');
jest.mock('../order-send-confirmation-email');

describe('site fn', () => {
  it('returns 200 from `wakeup` request', async () => {
    const event = { path: '/.netlify/functions/site/wakeup' };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 204 });
    expect(err).toBeNull();
  });

  it('404s good path but wrong http method', async () => {
    const event = {
      path: '/.netlify/functions/site/wakeup',
      httpMethod: 'POST', // <-- bad method!
    };
    const { res } = await invokeCb(router, event);
    expect(res.statusCode).toBe(404);
  });

  it('returns 404 from unknown path', async () => {
    const event = { path: '/.netlify/functions/site/bad/path' };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 404, body: 'Not Found' });
    expect(err).toBeNull();
  });

  const badPrintJobStatusPaths = [
    ['/site/print-job/123/status/41234/nope'],
    ['/site/print-job/123/status?foo=bar'],
    ['/site/print-job/letters/status'],
    ['/site/print-job/123/status/'], // <-- trailing slash
    ['/site/print-job/abc123/status'],
  ];

  test.each(badPrintJobStatusPaths)('%s is invalid path', async path => {
    const { res } = await invokeCb(router, { path });
    expect(res.statusCode).toBe(404);
  });

  it('good print job status url handled', async () => {
    (<jest.Mock>printJobStatus).mockImplementation((_, respond) => respond.noContent());
    await invokeCb(router, { path: '/site/print-job/123/status' });
    expect(printJobStatus).toHaveBeenCalled();
  });

  it('good print job status url handled', async () => {
    (<jest.Mock>sendOrderConfirmationEmail).mockImplementation((_, respond) =>
      respond.noContent(),
    );
    await invokeCb(router, {
      path: '/site/order/123/confirmation-email',
      httpMethod: 'POST',
    });
    expect(sendOrderConfirmationEmail).toHaveBeenCalled();
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
