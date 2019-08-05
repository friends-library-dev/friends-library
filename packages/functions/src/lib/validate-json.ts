import { Validator, Schema } from 'jsonschema';
import { SHIPPING_LEVELS } from './lulu';

const validator = new Validator();

export default function validateJson<Data>(
  body: string | null,
  schema: Schema & { example: Record<string, any> },
): Data | Error {
  if (process.env.NODE_ENV === 'development' || process.env.JEST_WORKER_ID) {
    const result = validator.validate(schema.example, schema);
    if (result.errors.length) {
      return new Error('schema.example does not validate');
    }
  }

  if (!body) {
    return new Error('Missing body');
  }

  try {
    const json = JSON.parse(body);
    const result = validator.validate(json, schema);
    if (result.errors.length) {
      // @ts-ignore https://github.com/tdegrunt/jsonschema/issues/286
      const errors = result.errors.map(e => e.stack).join(', ');
      return new Error(`Invalid JSON body: ${errors}`);
    }
    return json;
  } catch {
    return new Error('Un-parseable body');
  }
}

const addressSchema = {
  id: '/lulu-address',
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    street: { type: 'string', minLength: 2 },
    city: { type: 'string', minLength: 2 },
    state: { type: 'string', minLength: 2 },
    zip: { type: 'string', minLength: 1, maxLength: 64 },
    country: { type: 'string', minLength: 2, maxLength: 2 },
  },
  required: ['name', 'street', 'city', 'zip', 'state', 'country'],
};

validator.addSchema(addressSchema, '/lulu-address');
validator.addSchema({ enum: ['s', 'm', 'xl'] }, '/print-size');
validator.addSchema({ type: 'integer', minimum: 4 }, '/pages');
validator.addSchema({ type: 'integer', minimum: 1 }, '/book-qty');
// @ts-ignore (until https://github.com/tdegrunt/jsonschema/pull/287 merged)
validator.addSchema({ type: 'string', pattern: /\S+@\S+\.\S+/ }, '/email');
validator.addSchema(
  { enum: (SHIPPING_LEVELS as unknown) as any[] },
  '/lulu-shipping-level',
);
