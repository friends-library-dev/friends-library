import createOrder, { schema } from '../print-job-create';
import { invokeCb } from './invoke';
import { podPackageId } from '../../lib/lulu';
import { findById, persist } from '../../lib/Order';
import fetch from 'node-fetch';

const mockOrder = {
  id: 'mongo-id',
  set: jest.fn(),
  toJSON: () => ({ _id: 'mongo-id' }),
};
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  findById: jest.fn(() => Promise.resolve(mockOrder)),
  persist: jest.fn(),
}));

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({ credentials: { getToken } }));
});

const retrieveCharge = jest.fn(() => ({ id: 'ch_123abc', captured: false }));
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    charges: {
      retrieve: retrieveCharge,
    },
  }));
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const mockFetch = <jest.Mock>(<unknown>fetch);

describe('createOrder()', () => {
  let testBody = JSON.stringify(schema.example);

  it('should return 500 response if oauth token acquisition fails', async () => {
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_acquiring_oauth_token');
  });

  it('responds 400 if bad body passed', async () => {
    const data = JSON.parse(testBody);
    data.email = 'foo[at]bar[dot]com'; // <-- invalid email!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(400);
  });

  it('returns 403 if the stripe API doesn’t recognize the charge', async () => {
    retrieveCharge.mockImplementationOnce(() => {
      throw { statusCode: 404 };
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('charge_not_found');
  });

  it('returns 403 if the charge has already been captured', async () => {
    retrieveCharge.mockImplementationOnce(() => ({ id: '', captured: true }));

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('charge_already_captured');
  });

  it('returns 403 and passes on unknown stripe error', async () => {
    retrieveCharge.mockImplementationOnce(() => {
      throw { statusCode: 500, code: 'unknown_stripe_error' };
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('unknown_stripe_error');
  });

  it('responds 404 if order cannot be retrieved', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(null);

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe('order_not_found');
  });

  it('translates passed body into correct body to pass to lulu', async () => {
    mockFetch.mockImplementation(() => new Response('{}'));
    await invokeCb(createOrder, { body: testBody });
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchObject({
      external_id: schema.example.orderId,
      contact_email: schema.example.email,
      line_items: [
        {
          title: schema.example.items[0].title,
          cover: schema.example.items[0].coverUrl,
          interior: schema.example.items[0].interiorUrl,
          pod_package_id: podPackageId(
            schema.example.items[0].printSize,
            schema.example.items[0].pages,
          ),
          quantity: schema.example.items[0].quantity,
        },
      ],
      shipping_address: {
        name: schema.example.address.name,
        street1: schema.example.address.street,
        city: schema.example.address.city,
        country_code: schema.example.address.country,
        state_code: schema.example.address.state,
        postcode: schema.example.address.zip,
      },
      shipping_level: schema.example.shippingLevel,
    });
  });

  it('returns 500 if the request to lulu is invalid', async () => {
    mockFetch.mockImplementation(() => new Response('{}', { status: 400 }));
    const { res, json } = await invokeCb(createOrder, { body: testBody });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('lulu_400_error');
  });

  it('returns 201 with lulu order id if successful', async () => {
    mockFetch.mockImplementation(() => new Response('{"id":6}', { status: 201 }));
    const { res, json } = await invokeCb(createOrder, { body: testBody });
    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({ printJobId: 6 });
  });

  it('updates order with print job order and status on success', async () => {
    mockFetch.mockImplementation(() => new Response('{"id":6}', { status: 201 }));
    await invokeCb(createOrder, { body: testBody });
    expect(mockOrder.set).toHaveBeenCalledWith('print_job', { id: 6, status: 'pending' });
    expect(persist).toHaveBeenCalledWith(mockOrder);
  });
});
