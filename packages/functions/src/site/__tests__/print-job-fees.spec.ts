import printJobFees, { schema } from '../print-job-fees';
import { invokeCb } from './invoke';

const printJobCosts = jest.fn(() =>
  Promise.resolve([
    {
      line_item_costs: [
        {
          cost_excl_discounts: `4.81`,
        },
      ],
      shipping_cost: {
        total_cost_incl_tax: `3.99`,
        total_cost_excl_tax: `3.99`,
      },
      total_tax: `0.00`,
      total_cost_excl_tax: `8.80`,
      total_cost_incl_tax: `8.80`,
    },
    201,
  ]),
);
jest.mock(`@friends-library/lulu`, () => ({
  podPackageId: () => `pod-package-id`,
  LuluClient: class {
    printJobCosts = printJobCosts;
  },
}));

describe(`printJobFees()`, () => {
  it(`responds 400 if bad body passed`, async () => {
    const data = JSON.parse(JSON.stringify(schema.example));
    data.items[0].quantity = 0; // <-- invalid quantity!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(printJobFees, { body });
    expect(res.statusCode).toBe(400);
  });

  it(`translates passed body into correct body to pass to lulu`, async () => {
    const body = JSON.stringify(schema.example);
    await invokeCb(printJobFees, { body });
    expect(printJobCosts).toHaveBeenCalledWith({
      line_items: [
        {
          page_count: schema.example.items[0].pages,
          pod_package_id: `pod-package-id`,
          quantity: schema.example.items[0].quantity,
        },
      ],
      shipping_address: {
        name: schema.example.address.name,
        street1: schema.example.address.street,
        country_code: schema.example.address.country,
        state_code: schema.example.address.state,
        city: schema.example.address.city,
        postcode: schema.example.address.zip,
      },
      shipping_option: `MAIL`,
    });
  });

  it(`returns cheapest re-formatted fee information`, async () => {
    printJobCosts.mockResolvedValueOnce([
      {
        line_item_costs: [
          {
            cost_excl_discounts: `4.81`,
          },
        ],
        shipping_cost: {
          total_cost_incl_tax: `3.99`,
          total_cost_excl_tax: `3.99`,
        },
        total_tax: `0.00`,
        total_cost_excl_tax: `8.80`,
        total_cost_incl_tax: `8.80`,
      },
      201,
    ]);

    printJobCosts.mockResolvedValue([
      {
        line_item_costs: [
          {
            cost_excl_discounts: `4.81`,
          },
        ],
        shipping_cost: {
          total_cost_incl_tax: `6.99`,
          total_cost_excl_tax: `6.99`, // <-- more expensive!
        },
        total_tax: `0.00`,
        total_cost_excl_tax: `8.80`,
        total_cost_incl_tax: `11.80`,
      },
      201,
    ]);

    const body = JSON.stringify(schema.example);
    const { res, json } = await invokeCb(printJobFees, { body });
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({
      shipping: 399,
      shippingLevel: `MAIL`,
      taxes: 0,
      ccFeeOffset: 42,
    });
  });
});
