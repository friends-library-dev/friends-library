import { CommandBuilder } from 'yargs';

export const command = `docx <pattern>`;

export const describe = `convert asciidoc to docx format`;

export const builder: CommandBuilder = function (yargs) {
  return yargs.positional(`pattern`, {
    type: `string`,
    required: true,
    describe: `pattern to match repo dirs against`,
  });
};

export { default as handler } from './handler';
