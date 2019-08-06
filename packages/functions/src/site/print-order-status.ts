import { APIGatewayEvent } from 'aws-lambda';
import fetch from 'node-fetch';
import Responder from '../lib/Responder';
import { requireEnv } from '@friends-library/types';
import log from '../lib/log';
import { getAuthToken } from '../lib/lulu';

export default async function getOrderStatus(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const match = path.match(/\/(\d+)$/);
  if (!match) {
    log.error(`invalid get order status path: ${path}`);
    return respond.json({ msg: 'invalid_status_check_url' }, 400);
  }

  const luluOrderId = Number(match[1]);

  let token = '';
  try {
    token = await getAuthToken();
  } catch (error) {
    return respond.json({ msg: 'error_acquiring_oauth_token' }, 500);
  }

  const { LULU_API_ENDPOINT } = requireEnv('LULU_API_ENDPOINT');
  const res = await fetch(`${LULU_API_ENDPOINT}/print-jobs/${luluOrderId}/`, {
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    log.error(`${res.status} error fetching order status`, await res.json());
    switch (res.status) {
      case 404:
        return respond.json({ msg: 'order_not_found' }, 404);
      case 401:
        return respond.json({ msg: 'order_status_auth_error' }, 401);
      default:
        return respond.json({ msg: `order_status_${res.status}_error` }, res.status);
    }
  }

  const json = await res.json();
  respond.json({ status: json.status.name });
}
