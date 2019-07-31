import { APIGatewayEvent } from 'aws-lambda';
import Stripe from 'stripe';
import { requireEnv } from '@friends-library/types';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import log from '../lib/log';

const schema = {
  properties: {
    chargeId: {
      type: 'string',
    },
  },
  required: ['chargeId'],
  example: {
    chargeId: 'ch_a3bd4g',
  },
};

export default async function capturePayment(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /payment-capture', body);
    respond.json({ msg: data.message }, 400);
    return;
  }

  const { STRIPE_SECRET_KEY } = requireEnv('STRIPE_SECRET_KEY');
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const response = await stripe.charges.capture(data.chargeId);
    if (response.captured === true) {
      log(`captured charge: ${data.chargeId}`);
      respond.noContent();
    } else {
      log.error('unexpected response capturing charge', response);
      respond.json({ msg: 'Unexpected response' }, 500);
    }
  } catch (error) {
    log.error(`error capturing charge ${data.chargeId}`, error);
    respond.json({ msg: error.code }, 403);
  }
}
