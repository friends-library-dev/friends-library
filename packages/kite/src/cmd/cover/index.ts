import { CommandBuilder } from 'yargs';

export const command = 'cover';

export const describe = 'create a book cover';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .option('pages', {
      alias: 'p',
      type: 'number',
      demand: true,
    })
    .option('open', {
      alias: 'o',
      type: 'boolean',
      default: false,
    })
    .option('print-size', {
      alias: 's',
      choices: ['s', 'm', 'xl'],
      default: 'm',
    })
    .option('guides', {
      type: 'boolean',
      default: false,
    });
};

export { default as handler } from './handler';
