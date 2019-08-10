import { APIGatewayEvent } from 'aws-lambda';
import fetch from 'node-fetch';
import Responder from '../lib/Responder';
import { requireEnv } from '@friends-library/types';
import log from '../lib/log';
import { getAuthToken } from '../lib/lulu';

export default async function getPrintJobStatus(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const match = path.match(/\/(\d+)\/status$/);
  if (!match) {
    log.error(`invalid get order status path: ${path}`);
    return respond.json({ msg: 'invalid_status_check_url' }, 400);
  }

  const printJobId = Number(match[1]);

  let token = '';
  try {
    token = await getAuthToken();
  } catch (error) {
    log.error('error aquiring oath token', error);
    return respond.json({ msg: 'error_acquiring_oauth_token' }, 500);
  }

  const { LULU_API_ENDPOINT } = requireEnv('LULU_API_ENDPOINT');
  const res = await fetch(`${LULU_API_ENDPOINT}/print-jobs/${printJobId}/status/`, {
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    log.error(`${res.status} error fetching print job status`, await res.json());
    switch (res.status) {
      case 404:
        return respond.json({ msg: 'print_job_not_found' }, 404);
      case 401:
        return respond.json({ msg: 'print_job_status_auth_error' }, 401);
      default:
        return respond.json({ msg: `print_job_status_${res.status}_error` }, res.status);
    }
  }

  switch ((await res.json()).name) {
    case 'CREATED':
      return respond.json({ status: 'pending' });
    case 'REJECTED':
      return respond.json({ status: 'rejected' });
    case 'SHIPPED':
      return respond.json({ status: 'shipped' });
    case 'CANCELLED':
    case 'CANCELED':
      return respond.json({ status: 'canceled' });
    default:
      return respond.json({ status: 'accepted' });
  }
}
