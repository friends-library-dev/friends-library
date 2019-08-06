import { APIGatewayEvent } from 'aws-lambda';
import Stripe from 'stripe';
import fetch from 'node-fetch';
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
    respond.json({ msg: data.message }, 400);
    return;
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
      external_id: item.editionId,
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
  const { STRIPE_SECRET_KEY } = requireEnv('STRIPE_SECRET_KEY');
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const charge = await stripe.charges.retrieve(chargeId);
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
          editionId: { type: 'string', minLength: 36 },
          coverUrl: { type: 'string', minLength: 4 },
          interiorUrl: { type: 'string', minLength: 4 },
          pages: { $ref: '/pages' },
          printSize: { $ref: '/print-size' },
          quantity: { $ref: '/book-qty' },
        },
        required: [
          'pages',
          'printSize',
          'quantity',
          'title',
          'editionId',
          'coverUrl',
          'interiorUrl',
        ],
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
        title: 'Journal of George Fox (original)',
        editionId: 'e5a1ecfb-4f0a-4c71-80bf-3ee924d0f46c--original',
        coverUrl: '/cloud/loc/GF--(cover).pdf',
        interiorUrl: '/cloud/loc/GF--(print).pdf',
        printSize: 'm' as PrintSize,
        pages: 178,
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
