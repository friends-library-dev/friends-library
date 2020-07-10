import { checkoutErrors as Err } from '@friends-library/types';
import printJobStatus from '../print-job-status';
import { invokeCb } from './invoke';

const mockPrintJobStatus = jest.fn(() =>
  Promise.resolve([{ name: `pending` }, 200] as [any, number]),
);
jest.mock(`@friends-library/lulu`, () => ({
  LuluClient: class {
    printJobStatus = mockPrintJobStatus;
  },
}));

describe(`printJobStatus()`, () => {
  it(`should hit the lulu api with the extracted lulu id`, async () => {
    await invokeCb(printJobStatus, { path: `/1432/status` });
    expect(mockPrintJobStatus).toHaveBeenCalledWith(1432);
  });

  // @see https://api.lulu.com/docs/#section/Getting-Started/Check-Print-Job-Status
  const statuses = [
    [`CREATED`, `pending`],
    [`UNPAID`, `accepted`],
    [`PAYMENT_IN_PROGRESS`, `accepted`],
    [`PRODUCTION_DELAYED`, `accepted`],
    [`PRODUCTION_READY`, `accepted`],
    [`IN_PRODUCTION`, `accepted`],
    [`SHIPPED`, `shipped`],
    [`REJECTED`, `rejected`],
    [`CANCELED`, `canceled`],
  ];

  test.each(statuses)(`lulu %s --> status: %s`, async (lulu, ours) => {
    mockPrintJobStatus.mockResolvedValueOnce([{ name: lulu }, 200]);
    const { res, json } = await invokeCb(printJobStatus, { path: `/1432/status` });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ status: ours });
  });

  it(`responds 404 if order not found`, async () => {
    mockPrintJobStatus.mockResolvedValueOnce([[`not found`], 404]);
    const { res, json } = await invokeCb(printJobStatus, { path: `/1432/status` });
    expect(res.statusCode).toBe(404);
    expect(json).toMatchObject({ msg: Err.PRINT_JOB_NOT_FOUND });
  });

  it(`responds 401 if bad auth`, async () => {
    mockPrintJobStatus.mockResolvedValueOnce([[`some error`], 401]);
    const { res, json } = await invokeCb(printJobStatus, { path: `/1432/status` });
    expect(res.statusCode).toBe(401);
    expect(json).toMatchObject({ msg: Err.ERROR_FETCHING_PRINT_JOB_STATUS });
  });
});
