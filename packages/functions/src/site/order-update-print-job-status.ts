import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById, persist } from '../lib/Order';
import validateJson from '../lib/validate-json';

export default async function updateOrderPrintJobStatus(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for PATCH /orders/{:id}', { body: body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  try {
    const { orderId, printJobStatus } = data;
    const order = await findById(orderId);
    if (!order) {
      return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
    }
    order.set('print_job.status', printJobStatus);
    await persist(order);
    respond.json(order.toJSON());
  } catch (error) {
    log.error('error updating order', { error });
    respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDER }, 500);
  }
}

const schema = {
  properties: {
    orderId: {
      type: 'string',
    },
    printJobStatus: {
      type: 'string',
      enum: ['pending', 'accepted', 'rejected', 'canceled', 'shipped'],
    },
  },
  required: ['orderId', 'printJobStatus'],
  example: {
    orderId: 'abc123',
    printJobStatus: 'accepted',
  },
};
