import { checkoutErrors as Err } from '@friends-library/types';
import capture from '../payment-capture';
import { invokeCb } from './invoke';
import { findById, save } from '../../lib/order';

const captureIntent = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      capture: captureIntent,
    },
  }));
});

const mockOrder = { id: 'order-id' };
jest.mock('../../lib/order', () => ({
  findById: jest.fn(() => Promise.resolve([null, mockOrder])),
  save: jest.fn(() => Promise.resolve([null, true])),
}));

describe('/payment-capture handler', () => {
  const testBody = JSON.stringify({
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
    (<jest.Mock>findById).mockResolvedValueOnce([null, null]);
    const { res, json } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe(Err.FLP_ORDER_NOT_FOUND);
  });

  it('should update & persist the order with new payment.status', async () => {
    await invokeCb(capture, { body: testBody });
    expect((<jest.Mock>save).mock.calls[0][0]).toMatchObject({
      id: 'order-id',
      paymentStatus: 'captured',
    });
  });

  it('should still respond 204 if persisting order fails', async () => {
    (<jest.Mock>save).mockResolvedValueOnce([['error saving'], null]);
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
