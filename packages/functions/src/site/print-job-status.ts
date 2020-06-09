import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err } from '@friends-library/types';
import fetch from 'node-fetch';
import Responder from '../lib/Responder';
import env from '../lib/env';
import log from '../lib/log';
import { getAuthToken } from '../lib/lulu';

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

  let token = ``;
  try {
    token = await getAuthToken();
  } catch (error) {
    log.error(`error acquiring lulu oauth token`, { error });
    return respond.json({ msg: Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN }, 500);
  }

  const res = await fetch(
    `${env(`LULU_API_ENDPOINT`)}/print-jobs/${printJobId}/status/`,
    {
      headers: {
        'Cache-Control': `no-cache`,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status !== 200) {
    log.error(`${res.status} error fetching print job status`, {
      response: await res.json(),
    });
    switch (res.status) {
      case 404:
        return respond.json({ msg: Err.PRINT_JOB_NOT_FOUND }, 404);
      default:
        return respond.json({ msg: Err.ERROR_FETCHING_PRINT_JOB_STATUS }, res.status);
    }
  }

  switch ((await res.json()).name) {
    case `CREATED`:
      return respond.json({ status: `pending` });
    case `REJECTED`:
      return respond.json({ status: `rejected` });
    case `SHIPPED`:
      return respond.json({ status: `shipped` });
    case `CANCELLED`:
    case `CANCELED`:
      return respond.json({ status: `canceled` });
    default:
      return respond.json({ status: `accepted` });
  }
}
