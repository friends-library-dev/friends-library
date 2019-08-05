import calculateFees, { schema } from '../print-calculate-fees';
import { invokeCb } from './invoke';
import fetch from 'node-fetch';

jest.mock('node-fetch');

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({
    credentials: {
      getToken,
    },
  }));
});

const { Response } = jest.requireActual('node-fetch');

const mockFetch = <jest.Mock>(<unknown>fetch);

describe('calculateFees()', () => {
  it('should return 500 response if oauth token acquisition fails', async () => {
    const body = JSON.stringify(schema.example);
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const { res, json } = await invokeCb(calculateFees, { body });

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_acquiring_oauth_token');
  });

  it('responds 400 if bad body passed', async () => {
    const data = JSON.parse(JSON.stringify(schema.example));
    data.items[0].quantity = 0; // <-- invalid quantity!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(calculateFees, { body });
    expect(res.statusCode).toBe(400);
  });

  it('translates passed body into correct body to pass to lulu', async () => {
    mockFetch.mockImplementation(() => new Response('{}'));
    const body = JSON.stringify(schema.example);
    await invokeCb(calculateFees, { body });
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchObject({
      line_items: [
        {
          page_count: schema.example.items[0].pages,
          pod_package_id: '0550X0850BWSTDPB060UW444GXX',
          quantity: schema.example.items[0].quantity,
        },
      ],
      shipping_address: {
        name: schema.example.address.name,
        street1: schema.example.address.street,
        country_code: schema.example.address.country,
        state_code: schema.example.address.state,
        postcode: schema.example.address.zip,
      },
      shipping_option: 'MAIL',
    });
  });

  it('returns cheapest re-formatted fee information', async () => {
    // prettier-ignore
    mockFetch.mockReturnValueOnce(new Response(JSON.stringify({
      line_item_costs: [{
        cost_excl_discounts: '4.81',
      }],
      shipping_cost: {
        total_cost_incl_tax: '3.99',
        total_cost_excl_tax: '3.99',
      },
      total_tax: '0.00',
      total_cost_excl_tax: '8.80',
      total_cost_incl_tax: '8.80'
    }), { status: 201 }));

    // prettier-ignore
    mockFetch.mockResolvedValue({ status: 201, json: () => Promise.resolve({
      line_item_costs: [{
        cost_excl_discounts: '4.81',
      }],
      shipping_cost: {
        total_cost_incl_tax: '6.99',
        total_cost_excl_tax: '6.99', // <-- more expensive!
      },
      total_tax: '0.00',
      total_cost_excl_tax: '8.80',
      total_cost_incl_tax: '11.80'
    })});

    const body = JSON.stringify(schema.example);
    const { res, json } = await invokeCb(calculateFees, { body });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({
      shipping: 399,
      shippingLevel: 'MAIL',
      tax: 0,
      ccFee: 42,
    });
  });
});
