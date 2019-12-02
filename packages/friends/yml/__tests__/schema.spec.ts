import path from 'path';
import { Validator, Schema } from 'jsonschema';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob } from '../test-helpers';
import schema, { subSchemas } from '../../src/schema';

const validator = new Validator();
for (let key in subSchemas) {
  validator.addSchema(subSchemas[key], `/${key}`);
}

const files = yamlGlob(path.resolve(__dirname, '../../yml/*/*.yml'))
  .map(({ short, path }) => ({ path: short, contents: readFileSync(path, 'UTF-8') }))
  .map(({ path, contents }) => ({ path, json: safeLoad(contents) }));

files.forEach(({ path, json }) => {
  it(`${path} should validate`, () => {
    const result = validator.validate(json, schema);
    if (result.errors.length) {
      throw new Error(`${result.errors.map(e => e.stack).join('\n')}`);
    }
  });
});
