import { APIGatewayEvent } from 'aws-lambda';
import { charges } from 'stripe';
import stripeClient from '../lib/stripe';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById, persist } from '../lib/Order';

export default async function capturePayment(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /payment/capture', body);
    return respond.json({ msg: data.message }, 400);
  }

  const order = await findById(data.orderId);
  if (!order) {
    return respond.json({ msg: 'order_not_found' }, 404);
  }

  let charge: charges.ICharge;
  try {
    charge = await stripeClient().charges.capture(data.chargeId);
  } catch (error) {
    log.error(`error capturing charge ${data.chargeId}`, error);
    return respond.json({ msg: error.code }, 403);
  }

  if (charge.captured === false) {
    log.error('unexpected response capturing charge', charge);
    return respond.json({ msg: 'Unexpected response' }, 500);
  }

  try {
    order.set('payment.status', 'captured');
    await persist(order);
  } catch (error) {
    log.error('error updating flp order', error);
    // @TODO decide what to do here... cancel the charge the charge?
  }

  log(`captured charge: ${data.chargeId}`);
  respond.noContent();
}

const schema = {
  properties: {
    chargeId: {
      type: 'string',
    },
    orderId: {
      type: 'string',
    },
  },
  required: ['chargeId', 'orderId'],
  example: {
    chargeId: 'ch_a3bd4g',
    orderId: '5d49b249b58e56b378f13efe',
  },
};
