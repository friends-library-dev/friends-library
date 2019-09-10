import capture from '../payment-capture';
import { invokeCb } from './invoke';
import { findById, persist } from '../../lib/Order';

const captureCharge = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      capture: captureCharge,
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
    chargeId: 'charge-id',
    orderId: 'order-id',
  });

  it('should return 204 with chargeId if successful', async () => {
    captureCharge.mockResolvedValue({ id: 'charge-id', captured: true });

    const { res } = await invokeCb(capture, { body: testBody });

    expect(res.statusCode).toBe(204);
    expect(captureCharge).toHaveBeenCalledWith('charge-id');
  });

  it('should respond 404 if order cant be found', async () => {
    (<jest.Mock>findById).mockReturnValueOnce(null);
    const { res, json } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe('order_not_found');
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

  it('should return 500 if charge comes back not captured', async () => {
    captureCharge.mockResolvedValue({ id: 'charge-id', captured: false });
    const { res } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(500);
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    captureCharge.mockImplementation(() => {
      throw { code: 'charge_already_captured' };
    });
    const { res, json } = await invokeCb(capture, { body: testBody });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: 'charge_already_captured' });
  });

  it('should return 400 if invalid body', async () => {
    const { res } = await invokeCb(capture, {});
    expect(res.statusCode).toBe(400);
  });
});
