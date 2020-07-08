import { invokeCb } from './invoke';
import brick from '../order-brick';

jest.mock(`@friends-library/slack`);

const cancelIntent = jest.fn();
const createRefund = jest.fn();

jest.mock(`stripe`, () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      cancel: cancelIntent,
    },
    refunds: {
      create: createRefund,
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

  it(`attempts to refund the payment`, async () => {
    await invokeCb(brick, { body: JSON.stringify(body) });
    expect(createRefund).toHaveBeenCalledWith(
      { payment_intent: `pi_123abc` },
      { maxNetworkRetries: 5 },
    );
  });

  it(`attempts to cancel the payment intent`, async () => {
    await invokeCb(brick, { body: JSON.stringify(body) });
    expect(cancelIntent).toHaveBeenCalledWith(`pi_123abc`, { maxNetworkRetries: 5 });
  });
});
