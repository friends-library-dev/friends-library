import { checkoutErrors as Err } from '@friends-library/types';
import updateOrderPrintJobStatus from '../order-update-print-job-status';
import { invokeCb } from './invoke';
import { findById, save } from '../../lib/order';

jest.mock(`../../lib/order`, () => ({
  findById: jest.fn(),
  save: jest.fn(),
}));

describe(`updateOrderPrintJobStatus()`, () => {
  const body = JSON.stringify({ orderId: `123abc`, printJobStatus: `accepted` });

  it(`responds 400 if mal-formed body`, async () => {
    const badBody = JSON.stringify({ printJobStatus: `bad_status` });
    const { res } = await invokeCb(updateOrderPrintJobStatus, { body: badBody });
    expect(res.statusCode).toBe(400);
  });

  it(`updates & persists order, returning 200 and order body`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, { id: `order-id` }]);
    (<jest.Mock>save).mockResolvedValueOnce([null, true]);
    const { res, json } = await invokeCb(updateOrderPrintJobStatus, { body });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ id: `order-id`, printJobStatus: `accepted` });
    expect((<jest.Mock>save).mock.calls[0][0]).toMatchObject({
      id: `order-id`,
      printJobStatus: `accepted`,
    });
  });

  it(`responds 500 if save fails`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, { id: `order-id` }]);
    (<jest.Mock>save).mockResolvedValueOnce([[`err`], false]);
    const { res, json } = await invokeCb(updateOrderPrintJobStatus, { body });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_UPDATING_FLP_ORDER);
  });
});
