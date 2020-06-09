import { invokeCb } from './invoke';
import brick from '../order-brick';

jest.mock(`@friends-library/slack`);

const cancelIntent = jest.fn();
jest.mock(`stripe`, () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      cancel: cancelIntent,
    },
  }));
});

describe(`/orders/brick handler`, () => {
  let body: Record<string, string | string[] | number | null> = {};
  beforeEach(() => {
    body = {
      historyStates: [`foo`, `bar`, `baz`],
      paymentIntentId: `pi_123abc`,
      orderId: `234zxc345`,
      printJobId: 52342,
      userAgent: `OSX Frisco Bobcat`,
    };
  });

  it(`attempts to cancel the payment intent`, async () => {
    await invokeCb(brick, { body: JSON.stringify(body) });
    expect(cancelIntent).toHaveBeenCalledWith(`pi_123abc`);
  });
});
