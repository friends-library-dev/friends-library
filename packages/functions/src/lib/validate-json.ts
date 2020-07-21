import { Validator, Schema } from 'jsonschema';
import { SHIPPING_LEVELS } from '@friends-library/types';

const validator = new Validator();

export default function validateJson<Data>(
  body: string | null,
  schema: Schema & { example: Record<string, any> },
): Data | Error {
  if (process.env.NODE_ENV === `development` || process.env.JEST_WORKER_ID) {
    const result = validator.validate(schema.example, schema);
    if (result.errors.length) {
      return new Error(`schema.example does not validate`);
    }
  }

  if (!body) {
    return new Error(`Missing body`);
  }

  try {
    const json = JSON.parse(body);
    const result = validator.validate(json, schema);
    if (result.errors.length) {
      const errors = result.errors.map(e => e.stack).join(`, `);
      return new Error(`Invalid JSON body: ${errors}`);
    }
    return json;
  } catch {
    return new Error(`Un-parseable body`);
  }
}

const addressSchema = {
  id: `/address`,
  type: `object`,
  properties: {
    name: { type: `string`, minLength: 1 },
    street: { type: `string`, minLength: 1, maxLength: 30 },
    street2: { type: `string`, maxLength: 30 },
    city: { type: `string`, minLength: 1 },
    state: { type: `string`, minLength: 1 },
    zip: { type: `string`, minLength: 1, maxLength: 64 },
    country: { type: `string`, minLength: 2, maxLength: 2 },
  },
  required: [`name`, `street`, `city`, `zip`, `state`, `country`],
};

const UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

validator.addSchema(addressSchema, `/address`);
validator.addSchema({ enum: [`en`, `es`] }, `/lang`);
validator.addSchema({ enum: [`s`, `m`, `xl`] }, `/print-size`);
validator.addSchema({ enum: [`original`, `modernized`, `updated`] }, `/edition`);
validator.addSchema({ type: `integer`, minimum: 4 }, `/pages`);
validator.addSchema({ type: `integer`, minimum: 1 }, `/book-qty`);
validator.addSchema({ type: `string`, pattern: UUID }, `/uuid`);
validator.addSchema({ type: `string`, pattern: /\S+@\S+\.\S+/ }, `/email`);
validator.addSchema({ enum: [...SHIPPING_LEVELS] }, `/lulu-shipping-level`);
