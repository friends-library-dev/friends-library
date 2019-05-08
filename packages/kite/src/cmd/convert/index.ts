import { CommandBuilder } from 'yargs';

export const command = 'convert <file>';

export const describe = 'convert docbook.xml to asciidoc';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional('file', {
      type: 'string',
      describe: 'full filepath to docbook xml file',
    })
    .option('skip-refs', {
      type: 'boolean',
      default: false,
    });
};

export { default as handler } from './handler';
