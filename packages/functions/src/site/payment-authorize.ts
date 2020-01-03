import { APIGatewayEvent } from 'aws-lambda';
import stripeClient from '../lib/stripe';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import log from '../lib/log';

/**
 * This function is only required for local server-side integration testing.
 * In the real app, both of these steps are handled from the client using the
 * paymentIntent.CLIENT_SECRET and the stripe.confirmCardPayment() API.
 * To do integration testing, we have to manually do what would happen on the client,
 * viz, creating a payment method with a credit card, and attaching the payment
 * method to the payment intent object.
 */
export default async function authorizePayment(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  if (!isTestInvocation()) {
    log.error('/payment/authorize used outside of local testing');
    return respond.json({ msg: 'payment_confirm_production_attempt' }, 403);
  }

  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /payment/authorize', { body, error: data });
    return respond.json({ msg: data.message }, 400);
  }

  const intentId = data.paymentIntentId;

  try {
    var paymentMethod = await stripeClient().paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2029,
        cvc: '314',
      },
    });
  } catch (error) {
    log.error(`error creating payment method`, { error });
    return respond.json({ msg: error.code }, 500);
  }

  try {
    var intent = await stripeClient().paymentIntents.confirm(intentId, {
      payment_method: paymentMethod.id,
    });
  } catch (error) {
    log.error(`error confirming payment intent: ${intentId}`, { error });
    return respond.json({ msg: error.code }, 500);
  }

  if (intent.status !== 'requires_capture') {
    log.error('unexpected intent status after confirmation', { intent });
    return respond.json({ msg: intent.status }, 500);
  }

  log(`confirmed payment intent: ${intentId}`);
  respond.noContent();
}

const schema = {
  properties: {
    paymentIntentId: {
      type: 'string',
    },
  },
  required: ['paymentIntentId'],
  example: {
    paymentIntentId: 'pi_a3bd4g',
  },
};

function isTestInvocation(): boolean {
  if ((process.env.STRIPE_SECRET_KEY || '').match(/^sk_test_/) === null) {
    return false;
  }
  return process.env.NODE_ENV === 'development';
}
