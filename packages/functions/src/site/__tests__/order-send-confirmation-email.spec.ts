import { checkoutErrors as Err } from '@friends-library/types';
import mailer from '@sendgrid/mail';
import sendConfirmation from '../order-send-confirmation-email';
import { invokeCb } from './invoke';
import { findById } from '../../lib/order';

jest.mock(`@friends-library/slack`);

jest.mock(`@sendgrid/mail`, () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve([{ statusCode: 202 }])),
}));

const mockOrder = {
  id: `123`,
  email: `jared@netrivet.com`,
  items: [],
  address: {
    name: `Jared Henderson`,
  },
};
jest.mock(`../../lib/order`, () => ({
  findById: jest.fn(() => Promise.resolve([null, mockOrder])),
}));

describe(`sendOrderConfirmationEmail()`, () => {
  beforeEach(() => jest.clearAllMocks());

  it(`should return 204 if successful`, async () => {
    const { res } = await invokeCb(sendConfirmation, {
      path: `/site/orders/123/confirmation-email`,
    });
    expect(res.statusCode).toBe(204);
  });

  it(`should return 500 if sendgrid does not respond ok`, async () => {
    (<jest.Mock>mailer.send).mockResolvedValueOnce([{ statusCode: 419 }]);
    const { res, json } = await invokeCb(sendConfirmation, {
      path: `/site/orders/123/confirmation-email`,
    });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_SENDING_EMAIL);
  });

  it(`should respond 404 if order cant be found`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, null]);
    const { res, json } = await invokeCb(sendConfirmation, {
      path: `/site/orders/123/confirmation-email`,
    });
    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe(Err.FLP_ORDER_NOT_FOUND);
    expect(<jest.Mock>findById).toHaveBeenCalledWith(`123`);
  });

  it(`should send custom email data`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([
      null,
      { ...mockOrder, id: `345`, email: `foo@bar.com` },
    ]);
    await invokeCb(sendConfirmation, {
      path: `/site/orders/345/confirmation-email`,
    });
    expect((<jest.Mock>mailer.send).mock.calls[0][0].to).toBe(`foo@bar.com`);
    expect((<jest.Mock>mailer.send).mock.calls[0][0].text).toContain(`345`);
  });
});
