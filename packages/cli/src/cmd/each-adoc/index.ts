import { CommandBuilder } from 'yargs';

export const command = `each-adoc <pattern>`;

export const describe = `playground helper cmd for programatically interacting with adoc files from an edition`;

export const builder: CommandBuilder = function (yargs) {
  return yargs.positional(`pattern`, {
    type: `string`,
    required: true,
    describe: `pattern to match repo dirs against`,
  });
};

export { default as handler } from './handler';
