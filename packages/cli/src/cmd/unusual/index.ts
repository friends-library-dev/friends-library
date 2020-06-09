import { CommandBuilder } from 'yargs';

export const command = `unusual <path> [compare]`;

export const describe = `find unusual words in documents at given path`;

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional(`path`, {
      type: `string`,
      describe: `filepath to dir containing .adoc files (or individual file)`,
    })
    .positional(`compare`, {
      type: `string`,
      describe: `asciidoc dir/file to compare to all files at <path>`,
    })
    .option(`threshold`, {
      type: `number`,
      describe: `only print words that show up this many times or fewer`,
      default: 5,
      alias: `t`,
    })
    .option(`write`, {
      type: `boolean`,
      describe: `write words to a \`unusual.json\` file in cwd`,
      default: false,
      alias: `w`,
    });
};

export { default as handler } from './handler';
