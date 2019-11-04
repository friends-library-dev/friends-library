import fetchOrder from '../order-fetch';
import { invokeCb } from './invoke';
import { findById } from '../../lib/Order';

const mockOrder = {
  id: '123abc',
  set: jest.fn(),
  toJSON: () => ({ _id: '123abc' }),
};
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  findById: jest.fn(() => Promise.resolve(mockOrder)),
  persist: jest.fn(),
}));

describe('fetchOrder()', () => {
  let path = '/site/orders/123abc';

  const badPaths = [
    ['/site/orders/_nope'],
    ['/site/orders/41234?foo=bar'],
    ['/site/orders/6b0e134d-8d2e-48bc-8fa3-e8fc79793804'],
    ['/site/orders/'],
  ];

  test.each(badPaths)('%s is invalid path', async badPath => {
    const { res, json } = await invokeCb(fetchOrder, { path: badPath });
    expect(res.statusCode).toBe(400);
    expect(json).toMatchObject({ msg: 'invalid_fetch_order_url' });
  });

  it('responds 404 if order not found', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(null);
    const { res, json } = await invokeCb(fetchOrder, { path });
    expect(res.statusCode).toBe(404);
    expect(json).toMatchObject({ msg: 'order_not_found' });
  });

  it('responds 200 with order json if found', async () => {
    const { res, json } = await invokeCb(fetchOrder, { path });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ _id: '123abc' });
  });
});
