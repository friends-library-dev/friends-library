import { APIGatewayEvent } from 'aws-lambda';
import Stripe from 'stripe';
import { requireEnv } from '@friends-library/types';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import log from '../lib/log';

const schema = {
  properties: {
    token: {
      type: 'string',
    },
    amount: {
      type: 'integer',
    },
  },
  required: ['token', 'amount'],
  example: {
    token: 'tok_visa',
    amount: 1111,
  },
};

export default async function authorizePayment(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /payment/authorize', body);
    respond.json({ msg: data.message }, 400);
    return;
  }

  const { STRIPE_SECRET_KEY } = requireEnv('STRIPE_SECRET_KEY');
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    // @TODO @see https://stripe.com/docs/api/charges/create
    // for more useful options to send when creating the charge
    const charge = await stripe.charges.create({
      source: data.token,
      amount: data.amount,
      currency: 'usd',
      capture: false,
    });

    log('authorized charge', charge);
    respond.json({ chargeId: charge.id }, 201);
  } catch (error) {
    log.error('error authorizing charge', error);
    respond.json({ msg: error.code }, 403);
  }
}
