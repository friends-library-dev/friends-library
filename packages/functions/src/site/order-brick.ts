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
    log.error('Unparseable JSON body for /orders/brick', body);
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
  const msg = [
    'Bricked order!',
    `orderId: ${data.orderId},`,
    `printJobId: ${data.printJobId},`,
    `paymentItentId: ${data.paymentItentId},`,
    `userAgent: ${data.userAgent},`,
    `stateHistory: ${JSON.stringify(data.stateHistory)}`,
  ].join(' ');
  await slack.send(msg, SLACK_ERROR_CHANNEL || 'errors');

  respond.noContent();
}
