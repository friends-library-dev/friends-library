import path from 'path';
import { Validator } from 'jsonschema';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob } from '../test-helpers';
import schema, { subSchemas } from '../../src/schema';

const validator = new Validator();
for (const key in subSchemas) {
  validator.addSchema(subSchemas[key], `/${key}`);
}

const files = yamlGlob(path.resolve(__dirname, `../../yml/*/*.yml`))
  .concat([
    {
      name: `Fixture`,
      short: `fixture.yml`,
      path: path.resolve(__dirname, `../../src/__tests__/fixture.yml`),
    },
  ])
  .map(({ short, path }) => ({ path: short, contents: readFileSync(path, `UTF-8`) }))
  .map(({ path, contents }) => ({ path, json: safeLoad(contents) }));

files.forEach(({ path, json }) => {
  const lang = path.startsWith(`en`) ? `(english)` : `(spanish)`;

  it(`${path} ${lang} should validate against schema`, () => {
    let useSchema = schema;
    if (path.match(/^e(n|s)\/compila(tions|ciones)\.yml$/)) {
      useSchema = JSON.parse(JSON.stringify(schema));
      useSchema.properties.residences.required = false;
      useSchema.properties.died.required = false;
    }

    const result = validator.validate(json, useSchema);
    if (result.errors.length) {
      throw new Error(`${result.errors.map((e) => e.stack).join(`\n`)}`);
    }
  });
});
