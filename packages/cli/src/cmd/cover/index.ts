import { CommandBuilder } from 'yargs';

export const command = `cover`;

export const describe = `make a pdf book cover`;

export const builder: CommandBuilder = function (yargs) {
  return yargs.option(`pattern`, {
    alias: `p`,
    type: `string`,
    description: `pattern to restrict matched documents`,
    demand: false,
  });
};

export { default as handler } from './handler';
