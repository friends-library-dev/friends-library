import { CommandBuilder } from 'yargs';

export const command = 'make <pattern>';

export const describe = 'make consumable artifacts from a local path';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional('pattern', {
      type: 'string',
      required: true,
      describe: 'pattern to match repo dirs against',
    })
    .option('no-open', {
      alias: 'o',
      type: 'boolean',
      describe: 'do not open created file/s',
      default: false,
    })
    .option('no-frontmatter', {
      alias: 'f',
      type: 'boolean',
      describe: 'skip frontmatter',
      default: false,
    })
    .option('isolate', {
      alias: 'i',
      type: 'number',
      describe: 'isolate a file by number',
    })
    .option('condense', {
      type: 'boolean',
      describe: 'condense size (very large books)',
      default: false,
    })
    .option('print-size', {
      describe: 'print size (target=`pdf-print` only)',
      choices: ['s', 'm', 'xl'],
    })
    .option('check', {
      alias: 'c',
      type: 'boolean',
      describe: 'validate epub/mobi',
      default: false,
    })
    .option('email', {
      type: 'string',
      describe: 'email address to send to',
      default: false,
    })
    .option('send', {
      alias: 's',
      type: 'boolean',
      describe: 'send documents via email',
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
    .option('target', {
      alias: 't',
      type: 'array',
      coerce: targets => {
        return targets.reduce((acc: string[], target: string) => {
          switch (target) {
            case 'ebook':
              acc.push('epub', 'mobi');
              break;
            case 'pdf':
              acc.push('paperback-interior', 'web-pdf');
              break;
            case 'all':
              acc.push('paperback-interior', 'web-pdf', 'epub', 'mobi');
              break;
            case 'pi':
              acc.push('paperback-interior');
              break;
            case 'epub':
            case 'mobi':
            case 'web-pdf':
            case 'paperback-interior':
              acc.push(target);
              break;
            default:
              throw new Error(`Unknown target: \`${target}\``);
          }
          return acc;
        }, []);
      },
      describe: 'target format/s',
      default: ['paperback-interior'],
    });
};

export { default as handler } from './handler';
