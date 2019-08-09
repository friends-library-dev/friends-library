import auth, { schema } from '../payment-authorize';
import { invokeCb } from './invoke';
import { persist } from '../../lib/Order';

const createCharge = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      create: createCharge,
    },
  }));
});

const mockOrder = { id: 'mongo-id', set: jest.fn() };
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  persist: jest.fn(),
}));

describe('/payment-authorize handler', () => {
  it('should return 201 with chargeId and orderId if successful', async () => {
    createCharge.mockResolvedValue({ id: 'ch_id' });
    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });

    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({
      chargeId: 'ch_id',
      orderId: 'mongo-id',
    });
    expect(createCharge.mock.calls[0][0]).toMatchObject({
      source: 'tok_visa',
      amount: 1111,
      currency: 'usd',
      capture: false,
      metadata: { orderId: 'mongo-id' },
    });
    expect(persist).toHaveBeenCalledWith(mockOrder);
    expect(mockOrder.set).toHaveBeenCalledWith('charge_id', 'ch_id');
    expect(mockOrder.set).toHaveBeenCalledWith('payment_status', 'authorized');
  });

  it('responds 500 if persisting order fails', async () => {
    (<jest.Mock>persist).mockImplementationOnce(() => {
      throw new Error('Oh noes!');
    });

    const { res, json } = await invokeCb(auth, { body: JSON.stringify(schema.example) });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_saving_flp_order');
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    createCharge.mockImplementation(() => {
      throw { code: 'card_expired' };
    });
    const { res, json } = await invokeCb(auth, {
      body: JSON.stringify(schema.example),
    });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: 'card_expired' });
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
