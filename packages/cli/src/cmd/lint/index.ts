import { CommandBuilder } from 'yargs';

export const command = `lint <path>`;

export const describe = `lint asciidoc documents at given path`;

export const builder: CommandBuilder = function (yargs) {
  return yargs
    .positional(`path`, {
      type: `string`,
      describe: `filepath to dir containing .adoc files (or individual file)`,
    })
    .option(`rules`, {
      type: `array`,
      alias: `r`,
    })
    .option(`exclude`, {
      type: `array`,
      alias: `x`,
    })
    .option(`limit`, {
      type: `number`,
      alias: `l`,
    })
    .option(`fix`, {
      type: `boolean`,
      default: false,
      alias: `f`,
    })
    .option(`maybe`, {
      type: `boolean`,
      default: false,
      alias: `m`,
    });
};

export { default as handler } from './handler';
