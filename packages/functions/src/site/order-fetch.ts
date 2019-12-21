import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById } from '../lib/Order';

export default async function fetchOrder(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const match = path.match(/\/([a-z0-9]+)$/);
  if (!match) {
    log.error(`invalid get order status path: ${path}`);
    return respond.json({ msg: Err.INVALID_FETCH_FLP_ORDER_URL }, 400);
  }

  const orderId = match[1];
  const order = await findById(orderId);
  if (!order) {
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  respond.json(order.toJSON());
}
