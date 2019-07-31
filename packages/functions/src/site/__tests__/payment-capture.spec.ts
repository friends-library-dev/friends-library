import capture from '../payment-capture';
import { invokeCb } from './invoke';

const captureCharge = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      capture: captureCharge,
    },
  }));
});

describe('/payment-capture handler', () => {
  it('should return 204 with chargeId if successful', async () => {
    captureCharge.mockResolvedValue({ id: 'charge-id', captured: true });
    const body = JSON.stringify({ chargeId: 'charge-id' });

    const { res } = await invokeCb(capture, { body });

    expect(res.statusCode).toBe(204);
    expect(captureCharge).toHaveBeenCalledWith('charge-id');
  });

  it('should return 500 if charge comes back not captured', async () => {
    captureCharge.mockResolvedValue({ id: 'charge-id', captured: false });
    const body = JSON.stringify({ chargeId: 'charge-id' });

    const { res } = await invokeCb(capture, { body });

    expect(res.statusCode).toBe(500);
  });

  it('returns 403 with error code from stripe in case of error', async () => {
    captureCharge.mockImplementation(() => {
      throw { code: 'charge_already_captured' };
    });
    const body = JSON.stringify({ chargeId: 'charge-id' });
    const { res, json } = await invokeCb(capture, { body });
    expect(res.statusCode).toBe(403);
    expect(json).toMatchObject({ msg: 'charge_already_captured' });
  });

  it('should return 400 if invalid body', async () => {
    const { res } = await invokeCb(capture, {});
    expect(res.statusCode).toBe(400);
  });
});
