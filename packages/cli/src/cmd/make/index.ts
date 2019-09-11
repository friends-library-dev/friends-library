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
    .option('isolate', {
      alias: 'i',
      type: 'number',
      describe: 'isolate a file by number',
    });
};

export { default as handler } from './handler';
