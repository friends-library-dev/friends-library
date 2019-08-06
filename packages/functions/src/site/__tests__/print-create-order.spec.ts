import createOrder, { schema } from '../print-create-order';
import { invokeCb } from './invoke';
import { podPackageId } from '../../lib/lulu';
import fetch from 'node-fetch';

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
  it('should return 500 response if oauth token acquisition fails', async () => {
    const body = JSON.stringify(schema.example);
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const { res, json } = await invokeCb(createOrder, { body });

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_acquiring_oauth_token');
  });

  it('responds 400 if bad body passed', async () => {
    const data = JSON.parse(JSON.stringify(schema.example));
    data.emailAddress = 'foo[at]bar[dot]com'; // <-- invalid email!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(400);
  });

  it('returns 403 if the stripe API doesn’t recognize the charge', async () => {
    const body = JSON.stringify(schema.example);
    retrieveCharge.mockImplementationOnce(() => {
      throw { statusCode: 404 };
    });

    const { res, json } = await invokeCb(createOrder, { body });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('charge_not_found');
  });

  it('returns 403 if the charge has already been captured', async () => {
    const body = JSON.stringify(schema.example);
    retrieveCharge.mockImplementationOnce(() => ({ id: '', captured: true }));

    const { res, json } = await invokeCb(createOrder, { body });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('charge_already_captured');
  });

  it('returns 403 and passes on unknown stripe error', async () => {
    const body = JSON.stringify(schema.example);
    retrieveCharge.mockImplementationOnce(() => {
      throw { statusCode: 500, code: 'unknown_stripe_error' };
    });

    const { res, json } = await invokeCb(createOrder, { body });

    expect(res.statusCode).toBe(403);
    expect(json.msg).toBe('unknown_stripe_error');
  });

  it('translates passed body into correct body to pass to lulu', async () => {
    mockFetch.mockImplementation(() => new Response('{}'));
    const body = JSON.stringify(schema.example);
    await invokeCb(createOrder, { body });
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchObject({
      external_id: schema.example.orderId,
      contact_email: schema.example.emailAddress,
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
    const body = JSON.stringify(schema.example);
    const { res, json } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('lulu_400_error');
  });

  it('returns 201 with lulu order id if successful', async () => {
    mockFetch.mockImplementation(() => new Response('{"id":6}', { status: 201 }));
    const body = JSON.stringify(schema.example);
    const { res, json } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({ luluOrderId: 6 });
  });
});
