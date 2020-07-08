import { APIGatewayEvent } from 'aws-lambda';
import fetch from 'node-fetch';
import { checkoutErrors as Err } from '@friends-library/types';
import Responder from '../lib/Responder';
import { PrintSize } from '@friends-library/types';
import env from '../lib/env';
import validateJson from '../lib/validate-json';
import log from '../lib/log';
import { findById, save as saveOrder } from '../lib/order';
import { getAuthToken, podPackageId } from '../lib/lulu';

export default async function createPrintJob(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for /print-job`, { body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, detail: data.message }, 400);
  }

  const [findError, order] = await findById(data.orderId);
  if (!order) {
    log.error(`order not found for print job creation`, { data, error: findError });
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  try {
    var token = await getAuthToken();
  } catch (error) {
    log.error(`error acquiring lulu oauth token`, { error });
    return respond.json({ msg: Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN }, 500);
  }

  const payload = createOrderPayload(data);
  const res = await fetch(`${env(`LULU_API_ENDPOINT`)}/print-jobs/`, {
    method: `POST`,
    headers: {
      'Cache-Control': `no-cache`,
      'Content-Type': `application/json`,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (res.status > 201) {
    log.error(`bad request (${res.status}) to lulu api`, { json, payload });
    return respond.json({ msg: Err.ERROR_CREATING_PRINT_JOB }, 500);
  }

  order.printJobStatus = `pending`;
  order.printJobId = json.id;
  const [saveError] = await saveOrder(order);

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

function createOrderPayload(data: typeof schema.example): Record<string, any> {
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
    shippingLevel: `MAIL`,
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
      city: `Wadsworth`,
      state: `OH`,
      zip: `44281`,
      country: `US`,
    },
  },
};
