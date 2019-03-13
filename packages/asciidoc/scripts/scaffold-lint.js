const chalk = require('chalk');
const fs = require('fs');
const camelCase = require('lodash/camelcase');
const kebabCase = require('lodash/kebabcase');

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
  const index = fs.readFileSync(`${src}/lint/line-rules/index.js`).toString();
  const lines = index.trim().split('\n');
  lines.push(`export { default as ${camel} } from './${slug}';\n`);
  fs.writeFileSync(`${src}/lint/line-rules/index.js`, lines.join('\n'));

  let rule = fs.readFileSync(`${__dirname}/lint-rule-scaffold.js`).toString();
  let test = fs.readFileSync(`${__dirname}/lint-test-${multi}scaffold.js`).toString();
  rule = replaceStrings(rule, slug, camel);
  test = replaceStrings(test, slug, camel);
  fs.writeFileSync(`${src}/lint/line-rules/${slug}.js`, rule);
  fs.writeFileSync(`${src}/lint/line-rules/__tests__/${slug}-tests.js`, test);

} catch (e) {
  console.log(chalk.red(e.message));
  process.exit(1);
}

function replaceStrings(file, slug, camel) {
  return file
    .replace(/\.\.\/\.\.\/\.\.\//m, '../../../../../')
    .replace(/myRule/g, camel)
    .replace(/my-slug/g, slug);
}
