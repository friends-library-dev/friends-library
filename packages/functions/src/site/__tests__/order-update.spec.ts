import updateOrder from '../order-update';
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

describe('updateOrder()', () => {
  let body = '{"print_job.status":"accepted"}';
  let path = '/site/order/123abc';

  it('responds 400 if mal-formed body', async () => {
    const badBody = '{"print_job.status":"bad_status"}';
    const { res } = await invokeCb(updateOrder, { body: badBody, path });
    expect(res.statusCode).toBe(400);
  });

  const badPaths = [
    ['/site/order/41234/nope'],
    ['/site/order/41234?foo=bar'],
    ['/site/order/6b0e134d-8d2e-48bc-8fa3-e8fc79793804'],
    ['/site/order/'],
  ];

  test.each(badPaths)('%s is invalid path', async path => {
    const { res, json } = await invokeCb(updateOrder, { path, body });
    expect(res.statusCode).toBe(400);
    expect(json).toMatchObject({ msg: 'invalid_patch_order_url' });
  });

  it('updates & persists order, returning 200 and order body', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(mockOrder);
    const { res, json } = await invokeCb(updateOrder, { path, body });
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
    const { res, json } = await invokeCb(updateOrder, { path, body });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_updating_order');
  });
});
