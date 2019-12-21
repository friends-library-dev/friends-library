import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import stripeClient from '../lib/stripe';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import Order, { persist as persistOrder } from '../lib/Order';
import log from '../lib/log';

export default async function createOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /orders/create', body);
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  const order = new Order({
    email: data.email,
    items: data.items.map(i => ({
      ...i,
      document_id: i.documentId,
      unit_price: i.unitPrice,
    })),
    address: data.address,
  } as any);

  try {
    var paymentIntent = await stripeClient().paymentIntents.create({
      amount: data.amount,
      currency: 'usd',
      capture_method: 'manual',
      payment_method_types: ['card'],
      metadata: {
        orderId: order.id,
      },
    });
  } catch (error) {
    log.error('error creating payment intent', error);
    return respond.json({ msg: Err.ERROR_CREATING_STRIPE_PAYMENT_INTENT }, 403);
  }

  try {
    order.set('payment', {
      id: paymentIntent.id,
      status: 'authorized',
      amount: data.amount,
      shipping: data.shipping,
      taxes: data.taxes,
      cc_fee_offset: data.ccFeeOffset,
    });
    await persistOrder(order);
  } catch (error) {
    log.error('error persisting flp order', error);
    return respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDER }, 500);
  }

  log('created payment intent', paymentIntent);
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
    amount: { type: 'integer' },
    email: { $ref: '/email' },
    address: { $ref: '/lulu-address' },
    taxes: { type: 'integer' },
    shipping: { type: 'integer' },
    ccFeeOffset: { type: 'integer' },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          documentId: { $ref: '/uuid' },
          printSize: { $ref: '/print-size' },
          quantity: { $ref: '/book-qty' },
          unitPrice: { type: 'integer' },
        },
        required: ['documentId', 'edition', 'quantity', 'unitPrice'],
      },
    },
  },
  required: ['amount', 'email', 'address', 'items'],
  example: {
    amount: 1111,
    taxes: 0,
    shipping: 399,
    ccFeeOffset: 42,
    email: 'user@example.com',
    items: [
      {
        documentId: '6b0e134d-8d2e-48bc-8fa3-e8fc79793804',
        edition: 'modernized',
        quantity: 1,
        unitPrice: 231,
      },
    ],
    address: {
      name: 'Jared Henderson',
      street: '123 Mulberry Ln.',
      city: 'Wadsworth',
      state: 'OH',
      zip: '44281',
      country: 'US',
    },
  },
};
