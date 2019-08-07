import { APIGatewayEvent } from 'aws-lambda';
import fetch from 'node-fetch';
import stripeClient from '../lib/stripe';
import Responder from '../lib/Responder';
import { PrintSize, requireEnv } from '@friends-library/types';
import validateJson from '../lib/validate-json';
import log from '../lib/log';
import { getAuthToken, podPackageId } from '../lib/lulu';

export default async function createOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for /print/create-order', body);
    return respond.json({ msg: data.message }, 400);
  }

  const invalidChargeMsg = await verifyCharge(data.chargeId);
  if (invalidChargeMsg) {
    return respond.json({ msg: invalidChargeMsg }, 403);
  }

  let token = '';
  try {
    token = await getAuthToken();
  } catch (error) {
    return respond.json({ msg: 'error_acquiring_oauth_token' }, 500);
  }

  const { LULU_API_ENDPOINT } = requireEnv('LULU_API_ENDPOINT');
  const payload = createOrderPayload(data);
  const res = await fetch(`${LULU_API_ENDPOINT}/print-jobs/`, {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (res.status > 201) {
    log.error(`bad request (${res.status}) to lulu api`, json, payload);
    return respond.json({ msg: `lulu_${res.status}_error` }, 500);
  }

  respond.json({ luluOrderId: json.id }, 201);
}

function createOrderPayload(data: typeof schema.example): Record<string, any> {
  return {
    external_id: data.orderId,
    contact_email: data.emailAddress,
    line_items: data.items.map(item => ({
      title: item.title,
      cover: item.coverUrl,
      interior: item.interiorUrl,
      pod_package_id: podPackageId(item.printSize, item.pages),
      quantity: item.quantity,
    })),
    shipping_address: {
      name: data.address.name,
      street1: data.address.street,
      city: data.address.city,
      country_code: data.address.country,
      state_code: data.address.state,
      postcode: data.address.zip,
    },
    shipping_level: data.shippingLevel,
  };
}

async function verifyCharge(chargeId: string): Promise<string | void> {
  try {
    const charge = await stripeClient().charges.retrieve(chargeId);
    if (charge.captured === true) {
      log.error(`verify charge fail: charge ${chargeId} already captured`);
      return 'charge_already_captured';
    }
  } catch (error) {
    if (error.statusCode === 404) {
      log.error(`non-existent charge id: ${chargeId}`);
      return 'charge_not_found';
    }

    log.error(`error retrieving charge ${chargeId}`, error);
    return error.code as string;
  }
}

export const schema = {
  properties: {
    address: { $ref: '/lulu-address' },
    orderId: { type: 'string', minLength: 10 },
    chargeId: { type: 'string', minLength: 5 },
    emailAddress: { $ref: '/email' },
    shippingLevel: { $ref: '/lulu-shipping-level' },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 4 },
          coverUrl: { type: 'string', minLength: 4 },
          interiorUrl: { type: 'string', minLength: 4 },
          pages: { $ref: '/pages' },
          printSize: { $ref: '/print-size' },
          quantity: { $ref: '/book-qty' },
        },
        required: ['pages', 'printSize', 'quantity', 'title', 'coverUrl', 'interiorUrl'],
      },
    },
  },
  required: ['orderId', 'emailAddress', 'shippingLevel', 'chargeId', 'items', 'address'],
  example: {
    orderId: 'flp-order-id',
    emailAddress: 'jared@netrivet.com',
    shippingLevel: 'MAIL',
    chargeId: 'ch_123abc',
    items: [
      {
        title: 'Journal of Ambrose Rigge (modernized)',
        coverUrl:
          'https://friends-library-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--cover.pdf',
        interiorUrl:
          'https://friends-library-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--(print).pdf',
        printSize: 'm' as PrintSize,
        pages: 166,
        quantity: 1,
      },
    ],
    address: {
      name: 'Jared Henderson',
      street: '123 Mulberry Ln.',
      city: 'Wadsworth',
      state: 'OH',
      zip: '44281',
      country: 'US',
    },
  },
};
