import { CommandBuilder } from 'yargs';

export const command = 'isbns';

export const describe = 'interact with our block of isbns';

export const builder: CommandBuilder = function(yargs) {
  return yargs.option('next', {
    type: 'boolean',
    describe: 'print out the next unnassigned ISBN for usage',
    default: false,
  });
};

export { default as handler } from './handler';
