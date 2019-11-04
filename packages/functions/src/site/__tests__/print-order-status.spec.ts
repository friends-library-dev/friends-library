import fetch from 'node-fetch';
import printJobStatus from '../print-job-status';
import { invokeCb } from './invoke';

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({ credentials: { getToken } }));
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const mockFetch = <jest.Mock>(<unknown>fetch);
mockFetch.mockResolvedValue(new Response('{"name":"accepted"}'));

describe('printJobStatus()', () => {
  it('should hit the lulu api with the extracted lulu id', async () => {
    await invokeCb(printJobStatus, { path: '/1432/status' });
    expect(mockFetch.mock.calls[0][0]).toMatch(/\/print-jobs\/1432\//);
  });

  // @see https://api.lulu.com/docs/#section/Getting-Started/Check-Print-Job-Status
  const statuses = [
    ['CREATED', 'pending'],
    ['UNPAID', 'accepted'],
    ['PAYMENT_IN_PROGRESS', 'accepted'],
    ['PRODUCTION_DELAYED', 'accepted'],
    ['PRODUCTION_READY', 'accepted'],
    ['IN_PRODUCTION', 'accepted'],
    ['SHIPPED', 'shipped'],
    ['REJECTED', 'rejected'],
    ['CANCELED', 'canceled'],
    ['CANCELLED', 'canceled'],
  ];

  test.each(statuses)('lulu %s --> status: %s', async (lulu, ours) => {
    mockFetch.mockResolvedValueOnce(new Response(`{"name":"${lulu}"}`));
    const { res, json } = await invokeCb(printJobStatus, { path: '/1432/status' });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ status: ours });
  });

  it('responds 404 if order not found', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response('{"detail":"Not found."}', { status: 404 }),
    );
    const { res, json } = await invokeCb(printJobStatus, { path: '/1432/status' });
    expect(res.statusCode).toBe(404);
    expect(json).toMatchObject({ msg: 'print_job_not_found' });
  });

  it('responds 401 if bad auth', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response('{"detail":"Error decoding signature."}', { status: 401 }),
    );
    const { res, json } = await invokeCb(printJobStatus, { path: '/1432/status' });
    expect(res.statusCode).toBe(401);
    expect(json).toMatchObject({ msg: 'print_job_status_auth_error' });
  });
});
