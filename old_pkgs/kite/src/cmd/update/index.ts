import { CommandBuilder } from 'yargs';

export const command = 'update';

export const describe = 'update book assets';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .option('check', {
      alias: 'c',
      type: 'boolean',
      description: 'perform epub check',
      default: false,
      demand: false,
    })
    .option('build', {
      alias: 'b',
      type: 'boolean',
      description: 'trigger website re-builds on complete',
      default: false,
      demand: false,
    })
    .option('pattern', {
      alias: 'p',
      type: 'string',
      description: 'pattern to restrict updated assets',
      demand: false,
    })
    .option('use-cover-dev-server', {
      alias: 'x',
      type: 'boolean',
      describe: 'use already running dev server localhost:9999 for ebook cover',
      default: false,
      demand: false,
    });
};

export { default as handler } from './handler';
