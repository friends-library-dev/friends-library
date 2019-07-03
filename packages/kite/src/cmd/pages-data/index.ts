import { CommandBuilder } from 'yargs';

export const command = 'pages:update';

export const describe = 'gather data for estimating print pages from adoc';

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
