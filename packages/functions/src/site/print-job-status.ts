import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import { log } from '@friends-library/slack';
import Responder from '../lib/Responder';
import luluClient from '../lib/lulu';

export default async function getPrintJobStatus(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const match = path.match(/\/(\d+)\/status$/);
  if (!match) {
    log.error(`invalid get order status path: ${path}`);
    return respond.json({ msg: `invalid_status_check_url` }, 400);
  }

  const printJobId = Number(match[1]);

  const [json, status] = await luluClient().printJobStatus(printJobId);

  if (status !== 200) {
    log.error(`${status} error fetching print job status`, { response: json });
    switch (status) {
      case 404:
        return respond.json({ msg: Err.PRINT_JOB_NOT_FOUND }, 404);
      default:
        return respond.json({ msg: Err.ERROR_FETCHING_PRINT_JOB_STATUS }, status);
    }
  }

  switch (json.name) {
    case `CREATED`:
      return respond.json({ status: `pending` });
    case `REJECTED`:
      return respond.json({ status: `rejected` });
    case `SHIPPED`:
      return respond.json({ status: `shipped` });
    case `CANCELED`:
      return respond.json({ status: `canceled` });
    default:
      return respond.json({ status: `accepted` });
  }
}
