import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import { log } from '@friends-library/slack';
import { Client as DbClient } from '@friends-library/db';
import Responder from '../lib/Responder';
import env from '../lib/env';

export default async function fetchOrder(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const match = path.match(/\/([a-z0-9-]+)$/);
  if (!match) {
    log.error(`invalid get order status path: ${path}`);
    return respond.json({ msg: Err.INVALID_FETCH_FLP_ORDER_URL }, 400);
  }

  const [, orderId] = match;
  const db = new DbClient(env(`FAUNA_SERVER_SECRET`));
  const [error, order] = await db.orders.findById(orderId);

  if (!order) {
    log.error(`order ${orderId} not found`, { error });
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  respond.json(order);
}
