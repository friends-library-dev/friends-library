import { checkoutErrors as Err } from '@friends-library/types';
import auth, { schema } from '../order-create';
import { invokeCb } from './invoke';
import { create } from '../../lib/order';

const createIntent = jest.fn();

jest.mock(`uuid/v4`, () => {
  return jest.fn(() => `generated-uuid`);
});

jest.mock(`stripe`, () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: createIntent,
    },
  }));
});

jest.mock(`../../lib/order`, () => ({
  create: jest.fn(() => Promise.resolve([null, true])),
}));

describe(`/orders/create handler`, () => {
  it(`should return 201 with correct data if successful`, async () => {
    createIntent.mockResolvedValue({
      id: `intent_id`,
      client_secret: `intent_id_secret`,
    });
    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });

    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({
      paymentIntentId: `intent_id`,
      paymentIntentClientSecret: `intent_id_secret`,
      orderId: `generated-uuid`,
    });
    expect(createIntent.mock.calls[0][0]).toMatchObject({
      amount: 1111,
      currency: `usd`,
      capture_method: `manual`,
      payment_method_types: [`card`],
      metadata: { orderId: `generated-uuid` },
    });
    expect((<jest.Mock>create).mock.calls[0][0]).toMatchObject({
      id: `generated-uuid`,
      paymentId: `intent_id`,
      paymentStatus: `authorized`,
      amount: 1111,
      taxes: 0,
      ccFeeOffset: 42,
      shipping: 399,
    });
  });

  it(`responds 500 if persisting order fails`, async () => {
    (<jest.Mock>create).mockResolvedValueOnce([[`err`], null]);
    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_CREATING_FLP_ORDER);
  });

  it(`returns 403 with error code from stripe in case of error`, async () => {
    createIntent.mockImplementation(() => {
      throw { code: `card_expired` };
    });
    const { res, json } = await invokeCb(auth, {
      body: JSON.stringify(schema.example),
    });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: Err.ERROR_CREATING_STRIPE_PAYMENT_INTENT });
  });

  it(`should return 400 if missing body`, async () => {
    const { res } = await invokeCb(auth, {});
    expect(res.statusCode).toBe(400);
  });

  it(`should return 400 if un-parseable JSON`, async () => {
    const { res } = await invokeCb(auth, { body: `{"foo":` });
    expect(res.statusCode).toBe(400);
  });

  it(`should return 400 if missing required body field`, async () => {
    const body = { token: `token` }; // <-- missing `amount`
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });

  it(`should return 400 if field is wrong type`, async () => {
    const body = { token: `token`, amount: `111` }; // <-- amount != number
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });

  it(`should return 400 if amount is not integer`, async () => {
    const body = { token: `token`, amount: 11.11 }; // <-- amount != integer
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });
});
