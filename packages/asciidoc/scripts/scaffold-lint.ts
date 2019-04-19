import chalk from 'chalk';
import fs from 'fs';
import camelCase from 'lodash/camelcase';
import kebabCase from 'lodash/kebabcase';

const usage = 'yarn asciidoc:scaffold:lint my-new-rule-slug [--multiline]';

try {
  if (process.argv.length < 3) {
    throw new Error(`Must pass lint slug, e.g.: \`${usage}\``);
  }

  if (process.argv.length > 4) {
    throw new Error(`Too many args, try: \`${usage}\``);
  }

  if (process.argv.length === 4 && process.argv[3] !== '--multiline') {
    throw new Error(`Bad second arg, use \`--multiline\` like: \`${usage}\``);
  }

  const multi = process.argv.length === 4 ? 'multiline-' : '';
  const slug = process.argv[2];
  const camel = camelCase(slug);

  if (slug !== kebabCase(slug)) {
    throw new Error('Lint slug must be kebab-case: `my-lint-rule`');
  }

  const src = `${__dirname}/../src`;
  const index = fs.readFileSync(`${src}/lint/line-rules/index.ts`).toString();
  const lines = index.trim().split('\n');
  lines.push(`export { default as ${camel} } from './${slug}';\n`);
  fs.writeFileSync(`${src}/lint/line-rules/index.ts`, lines.join('\n'));

  let rule = fs.readFileSync(`${__dirname}/lint-rule-scaffold.ts`).toString();
  let test = fs.readFileSync(`${__dirname}/lint-test-${multi}scaffold.ts`).toString();
  rule = replaceStrings(rule, slug, camel);
  test = replaceStrings(test, slug, camel);
  fs.writeFileSync(`${src}/lint/line-rules/${slug}.ts`, rule);
  fs.writeFileSync(`${src}/lint/line-rules/__tests__/${slug}.spec.ts`, test);
} catch (e) {
  console.log(chalk.red(e.message));
  process.exit(1);
}

function replaceStrings(file: string, slug: string, camel: string) {
  return file
    .replace(/myRule/g, camel)
    .replace(/my-slug/g, slug)
    .replace(/(\s+)?\/\/ @ts-ignore\n/g, '');
}
