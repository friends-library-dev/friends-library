import { checkoutErrors as Err } from '@friends-library/types';
import capture from '../payment-capture';
import { invokeCb } from './invoke';
import { findById, persist } from '../../lib/Order';

const captureIntent = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      capture: captureIntent,
    },
  }));
});

const mockOrder = { id: 'mongo-id', set: jest.fn() };
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  findById: jest.fn(() => mockOrder),
  persist: jest.fn(),
}));

describe('/payment-capture handler', () => {
  let testBody = JSON.stringify({
    paymentIntentId: 'pi_123',
    orderId: 'order-id',
  });

  it('should capture correct paymentItent and respond 204', async () => {
    captureIntent.mockResolvedValue({ id: 'pi_123', status: 'succeeded' });

    const { res } = await invokeCb(capture, { body: testBody });

    expect(res.statusCode).toBe(204);
    expect(captureIntent).toHaveBeenCalledWith('pi_123');
  });

  it('should respond 404 if order cant be found', async () => {
    (<jest.Mock>findById).mockReturnValueOnce(null);
    const { res, json } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe(Err.FLP_ORDER_NOT_FOUND);
  });

  it('should update & persist the order with new payment.status', async () => {
    await invokeCb(capture, { body: testBody });
    expect(mockOrder.set).toHaveBeenCalledWith('payment.status', 'captured');
    expect(persist).toHaveBeenCalledWith(mockOrder);
  });

  it('should still respond 204 if persisting order fails', async () => {
    (<jest.Mock>persist).mockImplementationOnce(() => {
      throw new Error('Oh noes!');
    });

    const { res } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(204);
  });

  it('should return 500 if payment intent comes back not captured', async () => {
    captureIntent.mockResolvedValue({ id: 'pi_123', status: 'lol' });
    const { res } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(500);
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    captureIntent.mockImplementation(() => {
      throw { code: 'intent_already_captured' };
    });
    const { res, json } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: Err.ERROR_CAPTURING_STRIPE_PAYMENT_INTENT });
  });

  it('should return 400 if invalid body', async () => {
    const { res } = await invokeCb(capture, {});
    expect(res.statusCode).toBe(400);
  });
});
