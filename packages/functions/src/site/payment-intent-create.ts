import uuid from 'uuid/v4';
import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import { log } from '@friends-library/slack';
import Responder from '../lib/Responder';
import validateJson from '../lib/validate-json';
import stripeClient from '../lib/stripe';

export default async function createPaymentIntent(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for POST /payment-intent`, { body: body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  try {
    const orderId = uuid();
    const paymentIntent = await stripeClient().paymentIntents.create(
      {
        amount: data.amount,
        currency: `usd`,
        payment_method_types: [`card`],
        metadata: { orderId },
      },
      { maxNetworkRetries: 5 },
    );
    respond.json(
      {
        paymentIntentId: paymentIntent.id,
        paymentIntentClientSecret: paymentIntent.client_secret,
        orderId,
      },
      201,
    );
  } catch (err) {
    return respond.json({ msg: Err.ERROR_CREATING_STRIPE_PAYMENT_INTENT }, 500);
  }
}

const schema = {
  properties: {
    amount: {
      type: `number`,
      required: true,
    },
  },
  example: {
    amount: 2349,
  },
};
