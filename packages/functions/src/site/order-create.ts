import { APIGatewayEvent } from 'aws-lambda';
import uuid from 'uuid/v4';
import { checkoutErrors as Err } from '@friends-library/types';
import stripeClient from '../lib/stripe';
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
    log.error(`invalid body for /orders/create`, { body: body, data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, details: data.message }, 400);
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: uuid(),
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
    paymentId: `<pending>`,
    paymentStatus: `authorized`,
  };

  try {
    var paymentIntent = await stripeClient().paymentIntents.create(
      {
        amount: data.amount,
        currency: `usd`,
        capture_method: `manual`,
        payment_method_types: [`card`],
        metadata: { orderId: order.id },
      },
      {
        idempotency_key: order.id,
      },
    );
    order.paymentId = paymentIntent.id;
  } catch (error) {
    log.error(`error creating payment intent`, { error });
    return respond.json({ msg: Err.ERROR_CREATING_STRIPE_PAYMENT_INTENT }, 403);
  }

  const [error] = await createOrder(order);
  if (error) {
    log.error(`error creating flp order`, { error });
    return respond.json({ msg: Err.ERROR_CREATING_FLP_ORDER }, 500);
  }

  log.info(`created payment intent: ${paymentIntent.id}`);
  respond.json(
    {
      paymentIntentId: paymentIntent.id,
      paymentIntentClientSecret: paymentIntent.client_secret,
      orderId: order.id,
    },
    201,
  );
}

export const schema = {
  properties: {
    amount: { type: `integer` },
    email: { $ref: `/email` },
    address: { $ref: `/address` },
    taxes: { type: `integer` },
    shipping: { type: `integer` },
    ccFeeOffset: { type: `integer` },
    lang: { $ref: `/lang` },
    items: {
      type: `array`,
      minItems: 1,
      items: {
        type: `object`,
        properties: {
          title: { type: `string` },
          documentId: { $ref: `/uuid` },
          printSize: { $ref: `/print-size` },
          quantity: { $ref: `/book-qty` },
          unitPrice: { type: `integer` },
        },
        required: [`documentId`, `title`, `edition`, `quantity`, `unitPrice`],
      },
    },
  },
  required: [`amount`, `email`, `address`, `items`, `lang`],
  example: {
    amount: 1111,
    taxes: 0,
    shipping: 399,
    ccFeeOffset: 42,
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
