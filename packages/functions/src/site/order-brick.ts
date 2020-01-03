import { APIGatewayEvent } from 'aws-lambda';
import env from '@friends-library/env';
import * as slack from '@friends-library/slack';
import stripeClient from '../lib/stripe';
import Responder from '../lib/Responder';
import log from '../lib/log';

export default async function brickOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  try {
    var data = JSON.parse(body || '');
  } catch (error) {
    log.error('Unparseable JSON body for /orders/brick', { body: body, error });
    data = {};
  }

  if (data.paymentIntentId) {
    try {
      stripeClient().paymentIntents.cancel(data.paymentIntentId);
    } catch (error) {
      log.error('error cancelling payment intent', error);
    }
  }

  if (typeof data.printJobId === 'number' && data.printJobId > 0) {
    // cancel print job (waiting for response from Lulu rep, no documentation on HOW)
    // https://feedback.lulu.com/ideas/L2-I-168
  }

  const { SLACK_ERROR_CHANNEL } = env.get('SLACK_ERROR_CHANNEL');
  await slack.sendJson(
    '*Bricked Order*',
    { data },
    SLACK_ERROR_CHANNEL || 'errors',
    ':fire_engine:',
  );

  respond.noContent();
}
