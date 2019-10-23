import { CommandBuilder } from 'yargs';

export const command = 'update-pages';

export const describe = 'calculate length of paperbacks for all book editions';

export const builder: CommandBuilder = function(yargs) {
  return yargs.option('force-update', {
    alias: 'f',
    type: 'boolean',
    description:
      'force fresh updating of data, ignoring how recently the data was updated',
    default: false,
  });
};

export { default as handler } from './handler';
