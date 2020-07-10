import router from '../router';
import { invokeCb } from './invoke';
import sendOrderConfirmationEmail from '../order-send-confirmation-email';

jest.mock(`../order-send-confirmation-email`);

describe(`site fn`, () => {
  it(`returns 200 from \`wakeup\` request`, async () => {
    const event = { path: `/.netlify/functions/site/wakeup` };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 204 });
    expect(err).toBeNull();
  });

  it(`404s good path but wrong http method`, async () => {
    const event = {
      path: `/.netlify/functions/site/wakeup`,
      httpMethod: `POST`, // <-- bad method!
    };
    const { res } = await invokeCb(router, event);
    expect(res.statusCode).toBe(404);
  });

  it(`returns 404 from unknown path`, async () => {
    const event = { path: `/.netlify/functions/site/bad/path` };
    const { err, res } = await invokeCb(router, event);
    expect(res).toMatchObject({ statusCode: 404, body: `Not Found` });
    expect(err).toBeNull();
  });

  it(`good send confirmation email request handled correctly`, async () => {
    (<jest.Mock>sendOrderConfirmationEmail).mockImplementation((_, respond) =>
      respond.noContent(),
    );
    await invokeCb(router, {
      path: `/site/orders/123/confirmation-email`,
      httpMethod: `POST`,
    });
    expect(sendOrderConfirmationEmail).toHaveBeenCalled();
  });
});
