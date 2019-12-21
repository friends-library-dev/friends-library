import { checkoutErrors as Err } from '@friends-library/types';
import auth, { schema } from '../order-create';
import { invokeCb } from './invoke';
import { persist } from '../../lib/Order';

const createIntent = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: createIntent,
    },
  }));
});

const mockOrder = { id: 'mongo-id', set: jest.fn() };
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  persist: jest.fn(),
}));

describe('/orders/create handler', () => {
  it('should return 201 with correct data if successful', async () => {
    createIntent.mockResolvedValue({
      id: 'intent_id',
      client_secret: 'intent_id_secret',
    });
    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });

    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({
      paymentIntentId: 'intent_id',
      paymentIntentClientSecret: 'intent_id_secret',
      orderId: 'mongo-id',
    });
    expect(createIntent.mock.calls[0][0]).toMatchObject({
      amount: 1111,
      currency: 'usd',
      capture_method: 'manual',
      payment_method_types: ['card'],
      metadata: { orderId: 'mongo-id' },
    });
    expect(persist).toHaveBeenCalledWith(mockOrder);
    expect(mockOrder.set).toHaveBeenCalledWith('payment', {
      id: 'intent_id',
      status: 'authorized',
      amount: 1111,
      taxes: 0,
      cc_fee_offset: 42,
      shipping: 399,
    });
  });

  it('responds 500 if persisting order fails', async () => {
    (<jest.Mock>persist).mockImplementationOnce(() => {
      throw new Error('Oh noes!');
    });

    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_UPDATING_FLP_ORDER);
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    createIntent.mockImplementation(() => {
      throw { code: 'card_expired' };
    });
    const { res, json } = await invokeCb(auth, {
      body: JSON.stringify(schema.example),
    });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: Err.ERROR_CREATING_STRIPE_PAYMENT_INTENT });
  });

  it('should return 400 if missing body', async () => {
    const { res } = await invokeCb(auth, {});
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if un-parseable JSON', async () => {
    const { res } = await invokeCb(auth, { body: '{"foo":' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if missing required body field', async () => {
    const body = { token: 'token' }; // <-- missing `amount`
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if field is wrong type', async () => {
    const body = { token: 'token', amount: '111' }; // <-- amount != number
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if amount is not integer', async () => {
    const body = { token: 'token', amount: 11.11 }; // <-- amount != integer
    const { res } = await invokeCb(auth, { body: JSON.stringify(body) });
    expect(res.statusCode).toBe(400);
  });
});
