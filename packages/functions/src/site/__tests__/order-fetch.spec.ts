import { checkoutErrors as Err } from '@friends-library/types';
import fetchOrder from '../order-fetch';
import { invokeCb } from './invoke';

const id = `6b0e134d-8d2e-48bc-8fa3-e8fc79793804`;
const mockOrder = { id };
const findById = jest.fn(() => Promise.resolve([null, mockOrder]));

jest.mock(`@friends-library/db`, () => ({
  Client: class {
    orders = { findById };
  },
}));

describe(`fetchOrder()`, () => {
  const path = `/site/orders/${id}`;

  const badPaths = [
    [`/site/orders/_nope`],
    [`/site/orders/41234?foo=bar`],
    [`/site/orders/`],
  ];

  test.each(badPaths)(`%s is invalid path`, async badPath => {
    const { res, json } = await invokeCb(fetchOrder, { path: badPath });
    expect(res.statusCode).toBe(400);
    expect(json).toMatchObject({ msg: Err.INVALID_FETCH_FLP_ORDER_URL });
  });

  it(`responds 404 if order not found`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, null]);
    const { res, json } = await invokeCb(fetchOrder, { path });
    expect(res.statusCode).toBe(404);
    expect(json).toMatchObject({ msg: Err.FLP_ORDER_NOT_FOUND });
  });

  it(`responds 200 with order json if found`, async () => {
    const { res, json } = await invokeCb(fetchOrder, { path });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ id });
  });
});
