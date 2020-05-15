import { checkoutErrors as Err } from '@friends-library/types';
import createOrder, { schema } from '../print-job-create';
import { invokeCb } from './invoke';
import { podPackageId } from '../../lib/lulu';
import { findById, save } from '../../lib/order';
import fetch from 'node-fetch';

jest.mock('../../lib/order', () => ({
  findById: jest.fn(() => Promise.resolve([null, { id: 'order-id' }])),
  save: jest.fn(() => Promise.resolve([null, true])),
}));

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({ credentials: { getToken } }));
});

const retrieveIntent = jest.fn(() => ({ id: 'pi_abc123', status: 'requires_capture' }));
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      retrieve: retrieveIntent,
    },
  }));
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const mockFetch = <jest.Mock>(<unknown>fetch);

describe('createOrder()', () => {
  beforeEach(() => jest.clearAllMocks());

  const testBody = JSON.stringify(schema.example);

  it('should return 500 response if oauth token acquisition fails', async () => {
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN);
  });

  it('responds 400 if bad body passed', async () => {
    const data = JSON.parse(testBody);
    data.email = 'foo[at]bar[dot]com'; // <-- invalid email!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(400);
  });

  it('returns 403 if the stripe API doesn’t recognize the payment intent', async () => {
    retrieveIntent.mockImplementationOnce(() => {
      throw { statusCode: 404 };
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe(Err.STRIPE_PAYMENT_INTENT_NOT_FOUND);
  });

  it('returns 403 if the payment intent has already been captured', async () => {
    retrieveIntent.mockImplementationOnce(() => ({ id: '', status: 'succeeded' }));

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe(Err.STRIPE_PAYMENT_INTENT_ALREADY_CAPTURED);
  });

  it('returns 403 and passes on unknown stripe error', async () => {
    retrieveIntent.mockImplementationOnce(() => {
      throw { statusCode: 500, code: 'unknown_stripe_error' };
    });

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe(Err.ERROR_RETRIEVING_STRIPE_PAYMENT_INTENT);
  });

  it('responds 404 if order cannot be retrieved', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, null]);

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe(Err.FLP_ORDER_NOT_FOUND);
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
    expect(json.msg).toBe(Err.ERROR_CREATING_PRINT_JOB);
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
    expect((<jest.Mock>save).mock.calls[0][0]).toMatchObject({
      printJobId: 6,
      printJobStatus: 'pending',
    });
  });
});
