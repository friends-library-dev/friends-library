import { checkoutErrors as Err } from '@friends-library/types';
import updateOrderPrintJobStatus from '../order-update-print-job-status';
import { invokeCb } from './invoke';
import { findById, persist } from '../../lib/Order';

const mockOrder = {
  id: 'mongo-id',
  set: jest.fn(),
  toJSON: () => ({ _id: 'mongo-id' }),
};
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  findById: jest.fn(),
  persist: jest.fn(),
}));

describe('updateOrderPrintJobStatus()', () => {
  const body = '{"orderId":"123abc","printJobStatus":"accepted"}';

  it('responds 400 if mal-formed body', async () => {
    const badBody = '{"printJobStatus":"bad_status"}';
    const { res } = await invokeCb(updateOrderPrintJobStatus, { body: badBody });
    expect(res.statusCode).toBe(400);
  });

  it('updates & persists order, returning 200 and order body', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(mockOrder);
    const { res, json } = await invokeCb(updateOrderPrintJobStatus, { body });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ _id: 'mongo-id' });
    expect(mockOrder.set).toHaveBeenCalledWith('print_job.status', 'accepted');
    expect(persist).toHaveBeenCalledWith(mockOrder);
  });

  it('responds 500 if persist fails', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(mockOrder);
    (<jest.Mock>persist).mockImplementationOnce(() => {
      throw new Error('Oh noes!');
    });
    const { res, json } = await invokeCb(updateOrderPrintJobStatus, { body });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_UPDATING_FLP_ORDER);
  });
});
