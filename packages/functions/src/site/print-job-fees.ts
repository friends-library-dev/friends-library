import { APIGatewayEvent } from 'aws-lambda';
import {
  PrintSize,
  checkoutErrors as Err,
  ShippingLevel,
  SHIPPING_LEVELS,
} from '@friends-library/types';
import { LuluAPI, LuluClient, podPackageId } from '@friends-library/lulu';
import { log } from '@friends-library/slack';
import validateJson from '../lib/validate-json';
import Responder from '../lib/Responder';
import { feeOffset } from '../lib/stripe';
import luluClient from '../lib/lulu';

export default async function printJobFees(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error(`invalid body for /print-job/fees`, { body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY, details: data.message }, 400);
  }

  const client = luluClient();
  const cheapest = await calculateCheapest(data, client);
  if (!cheapest) {
    log.error(`shipping not possible`, { address: data.address });
    return respond.json({ msg: Err.SHIPPING_NOT_POSSIBLE }, 400);
  }

  respond.json(cheapest);
}

/**
 * Not all shipping types are available to all addresses,
 * not even the lowest `MAIL` type, so we need to request
 * all possible shipping types, then filter out the ones that
 * aren't possible for a given address, then choose the cheapest
 */
async function calculateCheapest(
  data: typeof schema.example,
  client: LuluClient,
): Promise<null | {
  shippingLevel: ShippingLevel;
  shipping: number;
  taxes: number;
  ccFeeOffset: number;
}> {
  const results = await Promise.all(
    SHIPPING_LEVELS.map(level => calculateForType(data, level, client)),
  );

  const [cheapest] = results
    .filter(({ statusCode }) => statusCode === 201)
    .sort(({ json: a }, { json: b }) =>
      Number(a.total_cost_incl_tax) < Number(b.total_cost_incl_tax) ? -1 : 1,
    );

  if (!cheapest) {
    return null;
  }

  return {
    shippingLevel: cheapest.shippingLevel,
    shipping: toCents(cheapest.json.shipping_cost.total_cost_excl_tax),
    taxes: toCents(cheapest.json.total_tax),
    ccFeeOffset: feeOffset(toCents(cheapest.json.shipping_cost.total_cost_incl_tax)),
  };
}

async function calculateForType(
  data: typeof schema.example,
  shippingLevel: ShippingLevel,
  client: LuluClient,
): Promise<{
  statusCode: number;
  json: LuluAPI.PrintJobCostsResponse;
  shippingLevel: ShippingLevel;
}> {
  const [json, statusCode] = await client.printJobCosts({
    line_items: data.items.map(item => ({
      page_count: item.pages,
      quantity: item.quantity,
      pod_package_id: podPackageId(item.printSize, item.pages),
    })),
    shipping_address: {
      name: data.address.name,
      street1: data.address.street,
      country_code: data.address.country,
      city: data.address.city,
      state_code: data.address.state,
      postcode: data.address.zip,
    },
    shipping_option: shippingLevel,
  });
  return { statusCode, json, shippingLevel };
}

function toCents(strNum: string): number {
  return Math.round(Number(strNum) * 100);
}

export const schema = {
  properties: {
    address: { $ref: `/address` },
    items: {
      type: `array`,
      minItems: 1,
      items: {
        type: `object`,
        properties: {
          pages: { $ref: `/pages` },
          printSize: { $ref: `/print-size` },
          quantity: { $ref: `/book-qty` },
        },
        required: [`pages`, `printSize`, `quantity`],
      },
    },
  },
  required: [`address`, `items`],
  example: {
    address: {
      name: `Jared Henderson`,
      street: `123 Mulberry Ln.`,
      city: `Wadsworth`,
      state: `OH`,
      zip: `44281`,
      country: `US`,
    },
    items: [
      {
        pages: 178,
        printSize: `m` as PrintSize,
        quantity: 1,
      },
    ],
  },
};
