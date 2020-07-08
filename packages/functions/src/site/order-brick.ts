import { APIGatewayEvent } from 'aws-lambda';
import stripeClient from '../lib/stripe';
import Responder from '../lib/Responder';
import log from '../lib/log';

export default async function brickOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  try {
    var data = JSON.parse(body || ``);
  } catch (error) {
    log.error(`Unparseable JSON body for /orders/brick`, { body: body, error });
    return;
  }

  if (data.paymentIntentId) {
    const client = stripeClient();
    const reqOpts = { maxNetworkRetries: 5 };

    try {
      const refund = await client.refunds.create(
        { payment_intent: data.paymentIntentId },
        reqOpts,
      );
      log.error(`Created refund ${refund.id} for bricked order`);
    } catch (error) {
      log.error(`Error creating refund for bricked order`, error);
    }

    try {
      await client.paymentIntents.cancel(data.paymentIntentId, reqOpts);
      log.error(`Canceled payment intent ${data.paymentIntentId} for bricked order`);
    } catch (error) {
      // you can only cancel PI's in certain states, which I think we should never be in
      // but this is here just for a safeguard, so this error is "expected"
      log.error(`Error cancelling payment intent (expected)`, error);
    }
  }

  log.error(`*Bricked Order*`, { data });
  respond.noContent();
}
