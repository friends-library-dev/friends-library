import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import { create as createOrder, Order } from '../lib/order';
import log from '../lib/log';

export default async function orderCreateHandler(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for /orders`, { body: body, data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, details: data.message }, 400);
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: data.id,
    lang: data.lang === `en` ? `en` : `es`,
    email: data.email,
    created: now,
    updated: now,
    items: data.items as Order['items'],
    address: data.address,
    amount: data.amount,
    shipping: data.shipping,
    taxes: data.taxes,
    ccFeeOffset: data.ccFeeOffset,
    paymentId: data.paymentId,
    printJobStatus: `presubmit`,
  };

  const [error] = await createOrder(order);
  if (error) {
    log.error(`error creating flp order`, { error });
    return respond.json({ msg: Err.ERROR_CREATING_FLP_ORDER }, 500);
  }

  respond.json(order, 201);
}

export const schema = {
  properties: {
    amount: { type: `integer`, required: true },
    id: { $ref: `/uuid`, required: true },
    email: { $ref: `/email`, required: true },
    address: { $ref: `/address`, required: true },
    taxes: { type: `integer`, required: true },
    shipping: { type: `integer`, required: true },
    paymentId: { type: `string`, required: true },
    ccFeeOffset: { type: `integer`, required: true },
    lang: { $ref: `/lang`, required: true },
    items: {
      type: `array`,
      minItems: 1,
      items: {
        type: `object`,
        properties: {
          title: { type: `string`, required: true },
          documentId: { $ref: `/uuid`, required: true },
          edition: { $ref: `/edition`, required: true },
          printSize: { $ref: `/print-size`, required: true },
          quantity: { $ref: `/book-qty`, required: true },
          unitPrice: { type: `integer`, required: true },
        },
      },
    },
  },
  example: {
    id: `f971b507-6ca3-4ebc-8388-86e3f245ef4b`,
    amount: 1111,
    taxes: 0,
    shipping: 399,
    ccFeeOffset: 42,
    paymentId: `pi_123abc`,
    email: `user@example.com`,
    lang: `en`,
    items: [
      {
        title: `Journal of George Fox (modernized)`,
        documentId: `6b0e134d-8d2e-48bc-8fa3-e8fc79793804`,
        edition: `modernized`,
        quantity: 1,
        unitPrice: 231,
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
