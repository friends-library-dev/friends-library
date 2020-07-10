import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err, PrintSize } from '@friends-library/types';
import { podPackageId, LuluAPI } from '@friends-library/lulu';
import { Client as DbClient } from '@friends-library/db';
import { log } from '@friends-library/slack';
import Responder from '../lib/Responder';
import validateJson from '../lib/validate-json';
import luluClient from '../lib/lulu';
import env from '../lib/env';

export default async function createPrintJob(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for /print-job`, { body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, detail: data.message }, 400);
  }

  const db = new DbClient(env(`FAUNA_SERVER_SECRET`));
  const [findError, order] = await db.orders.findById(data.orderId);
  if (!order) {
    log.error(`order not found for print job creation`, { data, error: findError });
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  const payload = createPrintJobPayload(data);
  const [json, status] = await luluClient().createPrintJob(payload);
  if (status > 201) {
    log.error(`bad request (${status}) to lulu api`, { json, payload });
    return respond.json({ msg: Err.ERROR_CREATING_PRINT_JOB }, 500);
  }

  order.printJobStatus = `pending`;
  order.printJobId = json.id;
  const [saveError] = await db.orders.save(order);

  if (saveError) {
    log.error(`error updating order with print_job details`, {
      error: saveError,
      data: {
        orderId: data.orderId,
        printJobId: json.id,
      },
    });
    // @TODO -- decide what to do here, we could cancel the lulu order
    // or just proceed, since it's not 100% critical to have updated
  }

  respond.json({ printJobId: order.printJobId }, 201);
  log.info(`print job ${order.printJobId} created`);
}

function createPrintJobPayload(
  data: typeof schema.example,
): LuluAPI.CreatePrintJobPayload {
  return {
    external_id: data.orderId,
    contact_email: data.email,
    line_items: data.items.map(item => ({
      title: item.title,
      cover: item.coverUrl,
      interior: item.interiorUrl,
      pod_package_id: podPackageId(item.printSize, item.pages),
      quantity: item.quantity,
    })),
    shipping_address: {
      name: data.address.name,
      street1: data.address.street,
      ...(data.address.street2 ? { street2: data.address.street2 } : {}),
      city: data.address.city,
      country_code: data.address.country,
      state_code: data.address.state,
      postcode: data.address.zip,
    },
    shipping_level: data.shippingLevel,
  };
}

export const schema = {
  properties: {
    address: { $ref: `/address` },
    orderId: { type: `string`, minLength: 10 },
    paymentIntentId: { type: `string`, minLength: 5 },
    email: { $ref: `/email` },
    shippingLevel: { $ref: `/lulu-shipping-level` },
    items: {
      type: `array`,
      minItems: 1,
      items: {
        type: `object`,
        properties: {
          title: { type: `string`, minLength: 4 },
          coverUrl: { type: `string`, minLength: 4 },
          interiorUrl: { type: `string`, minLength: 4 },
          pages: { $ref: `/pages` },
          printSize: { $ref: `/print-size` },
          quantity: { $ref: `/book-qty` },
        },
        required: [`pages`, `printSize`, `quantity`, `title`, `coverUrl`, `interiorUrl`],
      },
    },
  },
  required: [`orderId`, `email`, `shippingLevel`, `paymentIntentId`, `items`, `address`],
  example: {
    orderId: `flp-order-id`,
    email: `jared@netrivet.com`,
    shippingLevel: `MAIL` as const,
    paymentIntentId: `ch_123abc`,
    items: [
      {
        title: `Journal of Ambrose Rigge (modernized)`,
        coverUrl: `https://flp-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--cover.pdf`,
        interiorUrl: `https://flp-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--(print).pdf`,
        printSize: `m` as PrintSize,
        pages: 166,
        quantity: 1,
      },
    ],
    address: {
      name: `Jared Henderson`,
      street: `123 Mulberry Ln.`,
      street2: ``,
      city: `Wadsworth`,
      state: `OH`,
      zip: `44281`,
      country: `US`,
    },
  },
};
