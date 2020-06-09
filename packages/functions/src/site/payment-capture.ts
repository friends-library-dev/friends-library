import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import stripeClient from '../lib/stripe';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById, save as saveOrder } from '../lib/order';

export default async function capturePayment(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for /payment/capture`, { body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  const [findError, order] = await findById(data.orderId);
  if (!order) {
    log.error(`order ${data.orderId} not found`, { error: findError });
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  try {
    var intent = await stripeClient().paymentIntents.capture(data.paymentIntentId);
  } catch (error) {
    log.error(`error capturing payment intent ${data.paymentIntentId}`, { error });
    return respond.json(
      { msg: Err.ERROR_CAPTURING_STRIPE_PAYMENT_INTENT, details: error.message },
      403,
    );
  }

  if (intent.status !== `succeeded`) {
    log.error(`unexpected response capturing intent`, { intent });
    return respond.json({ msg: Err.ERROR_CAPTURING_STRIPE_PAYMENT_INTENT }, 500);
  }

  order.paymentStatus = `captured`;
  const [saveError] = await saveOrder(order);

  if (saveError) {
    log.error(`error updating flp order`, { error: saveError });
    // @TODO decide what to do here... cancel the payment intent?
  }

  log.info(`captured payment intent: ${data.paymentIntentId}`);
  respond.noContent();
}

const schema = {
  properties: {
    paymentIntentId: {
      type: `string`,
    },
    orderId: {
      type: `string`,
    },
  },
  required: [`paymentIntentId`, `orderId`],
  example: {
    paymentIntentId: `pi_a3bd4g`,
    orderId: `5d49b249b58e56b378f13efe`,
  },
};
