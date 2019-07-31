import { Handler, APIGatewayEvent, Callback, Context } from 'aws-lambda';
import Stripe from 'stripe';
import { requireEnv } from '@friends-library/types';
import validateJson from '../lib/validate-json';

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

const handler: Handler = async (
  { body }: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  const respond = makeResponder(callback);
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    respond(400, { msg: data.message });
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

    respond(201, { chargeId: charge.id });
  } catch (e) {
    respond(403, { msg: e.code });
  }
};

export default handler;

function makeResponder(
  callback: Callback,
): (statusCode: number, body: Record<string, any>) => void {
  return (statusCode, body) => {
    callback(null, { statusCode, body: JSON.stringify(body) });
  };
}
