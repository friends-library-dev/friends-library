import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById, persist } from '../lib/Order';
import validateJson from '../lib/validate-json';

export default async function updateOrder(
  { body, path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const pathMatch = path.match(/\/orders\/([a-z0-9]+)$/);
  if (!pathMatch) {
    log.error(`invalid update order path: ${path}`);
    return respond.json({ msg: Err.INVALID_PATCH_FLP_ORDER_URL }, 400);
  }

  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for PATCH /orders/{:id}', body);
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  try {
    const orderId = String(pathMatch[1]);
    const order = await findById(orderId);
    if (!order) {
      return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
    }
    order.set('print_job.status', data['print_job.status']);
    await persist(order);
    respond.json(order.toJSON());
  } catch (error) {
    log.error('error updating order', error);
    respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDER }, 500);
  }
}

const schema = {
  properties: {
    'print_job.status': {
      type: 'string',
      enum: ['pending', 'accepted', 'rejected', 'canceled', 'shipped'],
    },
  },
  required: ['print_job.status'],
  example: {
    'print_job.status': 'accepted',
  },
};
