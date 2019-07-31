import auth from '../payment-authorize';
import { invokeCb } from './invoke';

const createCharge = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      create: createCharge,
    },
  }));
});

describe('/payment-authorize handler', () => {
  it('should return 201 with chargeId if successful', async () => {
    createCharge.mockResolvedValue({ id: 'ch_1F2LpjEswFkMHmtgZE014Ici' });
    const body = { token: 'my-token', amount: 1111 };

    const { res, json } = await invokeCb(auth, {
      body: JSON.stringify(body),
    });

    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({ chargeId: 'ch_1F2LpjEswFkMHmtgZE014Ici' });
    expect(createCharge).toHaveBeenCalledWith({
      source: 'my-token',
      amount: 1111,
      currency: 'usd',
      capture: false,
    });
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    createCharge.mockImplementation(() => {
      throw { code: 'card_expired' };
    });
    const body = { token: 'my-token', amount: 1111 };
    const { res, json } = await invokeCb(auth, {
      body: JSON.stringify(body),
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
