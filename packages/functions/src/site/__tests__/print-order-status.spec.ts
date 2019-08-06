import fetch from 'node-fetch';
import getOrderStatus from '../print-order-status';
import { invokeCb } from './invoke';

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({ credentials: { getToken } }));
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const mockFetch = <jest.Mock>(<unknown>fetch);
mockFetch.mockResolvedValue(
  new Response(JSON.stringify({ status: { name: 'ACCEPTED' } })),
);

describe('getOrderStatus()', () => {
  const badPaths = [
    ['/site/print/order-status/41234/nope'],
    ['/site/print/order-status/41234?foo=bar'],
    ['/site/print/order-status/6b0e134d-8d2e-48bc-8fa3-e8fc79793804'],
    ['/site/print/order-status/'],
  ];

  test.each(badPaths)('%s is invalid path', async path => {
    const { res, json } = await invokeCb(getOrderStatus, { path });
    expect(res.statusCode).toBe(400);
    expect(json).toMatchObject({ msg: 'invalid_status_check_url' });
  });

  it('should pass hit the lulu api with the extracted lulu id', async () => {
    await invokeCb(getOrderStatus, { path: '/1432' });
    expect(mockFetch.mock.calls[0][0]).toMatch(/\/print-jobs\/1432\//);
  });

  it('passes on successfully retrieved status', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ status: { name: 'REJECTED' } })),
    );
    const { res, json } = await invokeCb(getOrderStatus, { path: '/1432' });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ status: 'REJECTED' });
  });

  it('responds 404 if order not found', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Not found.' }), { status: 404 }),
    );
    const { res, json } = await invokeCb(getOrderStatus, { path: '/1432' });
    expect(res.statusCode).toBe(404);
    expect(json).toMatchObject({ msg: 'order_not_found' });
  });

  it('responds 401 if bad auth', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Error decoding signature.' }), {
        status: 401,
      }),
    );
    const { res, json } = await invokeCb(getOrderStatus, { path: '/1432' });
    expect(res.statusCode).toBe(401);
    expect(json).toMatchObject({ msg: 'fetch_order_status_auth_error' });
  });
});
