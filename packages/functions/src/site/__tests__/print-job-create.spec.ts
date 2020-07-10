import { checkoutErrors as Err } from '@friends-library/types';
import { podPackageId } from '@friends-library/lulu';
import createOrder, { schema } from '../print-job-create';
import { invokeCb } from './invoke';

const createPrintJob = jest.fn(() => Promise.resolve([{ id: 123 }, 201]));
const findById = jest.fn(() => Promise.resolve([null, { id: `order-id` }]));
const save = jest.fn(() => Promise.resolve([null, true]));

jest.mock(`@friends-library/lulu`, () => ({
  podPackageId: () => `podpackageid`,
  LuluClient: class {
    createPrintJob = createPrintJob;
  },
}));

jest.mock(`@friends-library/db`, () => ({
  Client: class {
    orders = { findById, save };
  },
}));

describe(`createOrder()`, () => {
  beforeEach(() => jest.clearAllMocks());

  const testBody = JSON.stringify(schema.example);

  it(`responds 400 if bad body passed`, async () => {
    const data = JSON.parse(testBody);
    data.email = `foo[at]bar[dot]com`; // <-- invalid email!
    const body = JSON.stringify(data);
    const { res } = await invokeCb(createOrder, { body });
    expect(res.statusCode).toBe(400);
  });

  it(`responds 404 if order cannot be retrieved`, async () => {
    (<jest.Mock>findById).mockResolvedValueOnce([null, null]);

    const { res, json } = await invokeCb(createOrder, { body: testBody });

    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe(Err.FLP_ORDER_NOT_FOUND);
  });

  it(`translates passed body into correct body to pass to lulu`, async () => {
    await invokeCb(createOrder, { body: testBody });
    expect(createPrintJob).toHaveBeenCalledWith({
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

  it(`returns 500 if the request to lulu is invalid`, async () => {
    createPrintJob.mockResolvedValueOnce([500, 500]);
    const { res, json } = await invokeCb(createOrder, { body: testBody });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_CREATING_PRINT_JOB);
  });

  it(`returns 201 with lulu order id if successful`, async () => {
    const { res, json } = await invokeCb(createOrder, { body: testBody });
    expect(res.statusCode).toBe(201);
    expect(json).toMatchObject({ printJobId: 123 });
  });

  it(`updates order with print job order and status on success`, async () => {
    await invokeCb(createOrder, { body: testBody });
    expect((<jest.Mock>save).mock.calls[0][0]).toMatchObject({
      printJobId: 123,
      printJobStatus: `pending`,
    });
  });
});
