import { CommandBuilder } from 'yargs';

export const command = ['publish <path>', '$0'];

export const describe = 'publish asciidoc documents at given path';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional('path', {
      type: 'string',
      required: true,
      describe: 'absolute filepath to root dir containing doc repos',
    })
    .option('no-frontmatter', {
      alias: 'f',
      type: 'boolean',
      describe: 'include frontmatter',
      default: false,
    })
    .option('perform', {
      alias: 'p',
      type: 'boolean',
      describe: '@todo -- rethink this param',
      default: false,
    })
    .option('open', {
      alias: 'o',
      type: 'boolean',
      describe: 'open document after creation',
      default: false,
    })
    .option('glob', {
      alias: 'g',
      type: 'string',
      describe: 'only render files matching this pattern',
    })
    .option('send', {
      alias: 's',
      type: 'boolean',
      describe: 'send documents via email',
      default: false,
    })
    .option('create-ebook-cover', {
      alias: 'e',
      type: 'boolean',
      describe: 'create ebook cover',
      default: false,
    })
    .option('use-cover-dev-server', {
      alias: 'x',
      type: 'boolean',
      describe: 'use already running dev server localhost:9999 for ebook cover',
      default: false,
    })
    .option('email', {
      type: 'string',
      describe: 'email address to send to',
      default: false,
    })
    .option('target', {
      alias: 't',
      type: 'array',
      coerce: targets => {
        switch (JSON.stringify(targets)) {
          case '["ebook"]':
            return ['epub', 'mobi'];
          case '["pdf"]':
            return ['pdf-print', 'pdf-web'];
          case '["all"]':
            return ['epub', 'mobi', 'pdf-print', 'pdf-web'];
          default:
            return targets;
        }
      },
      describe: 'target format/s',
      default: ['pdf-print'],
    })
    .option('check', {
      alias: 'c',
      type: 'boolean',
      describe: 'validate epub/mobi',
      default: false,
    })
    .option('skip-lint', {
      type: 'boolean',
      describe: 'bypass asciidoc linting',
      default: false,
    })
    .option('fix', {
      type: 'boolean',
      describe: 'auto-fix asciidoc lint errors',
      default: false,
    })
    .option('condense', {
      type: 'boolean',
      describe: 'condense size (very large books)',
      default: false,
    })
    .option('print-size', {
      describe: 'print size (target=`pdf-print` only)',
      choices: ['s', 'm', 'xl'],
    });
};

export { default as handler } from './handler';
