import { validate, Schema } from 'jsonschema';

export default function validateJson<Data>(
  body: string | null,
  schema: Schema & { example: Record<string, any> },
): Data | Error {
  if (process.env.NODE_ENV === 'development' || process.env.JEST_WORKER_ID) {
    const result = validate(schema.example, schema);
    if (result.errors.length) {
      return new Error('schema.example does not validate');
    }
  }

  if (!body) {
    return new Error('Missing body');
  }

  try {
    const json = JSON.parse(body);
    const result = validate(json, schema);
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
