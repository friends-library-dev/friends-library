import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import stripeClient from '../lib/stripe';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import { persist, findById } from '../lib/Order';
import log from '../lib/log';

export default async function updateOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /orders/update', { body: body, data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, details: data.message }, 400);
  }

  try {
    await stripeClient().paymentIntents.update(data.paymentIntentId, {
      amount: data.amount,
    });
    log(`updated payment intent: ${data.paymentIntentId}`);
  } catch (error) {
    log.error('error updating payment intent', { error });
    return respond.json({ msg: Err.ERROR_UPDATING_STRIPE_PAYMENT_INTENT }, 403);
  }

  const order = await findById(data.orderId);
  if (!order) {
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  try {
    order.set('email', data.email);
    order.set('address', data.address);
    order.set(
      'items',
      data.items.map(i => ({
        ...i,
        document_id: i.documentId,
        unit_price: i.unitPrice,
      })),
    );
    order.set('payment', {
      id: data.paymentIntentId,
      status: order.get('payment.status'),
      amount: data.amount,
      shipping: data.shipping,
      taxes: data.taxes,
      cc_fee_offset: data.ccFeeOffset,
    });
    await persist(order);
    log(`updated order: ${data.orderId}`);
  } catch (error) {
    log.error('error persisting flp order', { error });
    return respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDER, error: error.message }, 500);
  }

  respond.noContent();
}

export const schema = {
  properties: {
    orderId: { type: 'string' },
    paymentIntentId: { type: 'string' },
    amount: { type: 'integer' },
    email: { $ref: '/email' },
    address: { $ref: '/address' },
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
  required: ['orderId', 'paymentIntentId', 'amount', 'email', 'address', 'items'],
  example: {
    orderId: '123abc',
    paymentIntentId: 'pi_345def',
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
