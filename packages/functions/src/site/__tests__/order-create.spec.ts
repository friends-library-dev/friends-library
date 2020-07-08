import { checkoutErrors as Err } from '@friends-library/types';
import auth, { schema } from '../order-create';
import { invokeCb } from './invoke';
import { create } from '../../lib/order';

const createIntent = jest.fn();

jest.mock(`../../lib/order`, () => ({
  create: jest.fn(() => Promise.resolve([null, true])),
}));

describe(`/orders create handler`, () => {
  it(`should return 201 with correct data if successful`, async () => {
    createIntent.mockResolvedValue({
      id: `intent_id`,
      client_secret: `intent_id_secret`,
    });
    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });

    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({ id: schema.example.id });
    expect((<jest.Mock>create).mock.calls[0][0]).toMatchObject({
      id: schema.example.id,
      shippingLevel: schema.example.shippingLevel,
      paymentId: schema.example.paymentId,
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
