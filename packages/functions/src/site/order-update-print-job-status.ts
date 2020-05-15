import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err, PRINT_JOB_STATUSES } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById, save as saveOrder } from '../lib/order';
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

  const { orderId, printJobStatus } = data;
  const [findError, order] = await findById(orderId);
  if (!order) {
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND, error: findError }, 404);
  }

  order.printJobStatus = printJobStatus;
  const [error] = await saveOrder(order);
  if (error) {
    log.error('error updating order', { error });
    return respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDER, error }, 500);
  }

  respond.json(order);
}

const schema = {
  properties: {
    orderId: {
      type: 'string',
    },
    printJobStatus: {
      type: 'string',
      enum: (PRINT_JOB_STATUSES as unknown) as string[],
    },
  },
  required: ['orderId', 'printJobStatus'],
  example: {
    orderId: 'abc123',
    printJobStatus: 'accepted' as const,
  },
};
