import { CommandBuilder } from 'yargs';

export const command = `chapterize <file> <dest> [chStart]`;

export const describe = `covert docbook xml to asciidoc`;

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional(`file`, {
      type: `string`,
      describe: `full filepath to adoc file to be chapterized`,
    })
    .positional(`dest`, {
      type: `string`,
      describe: `relative (to DOCS_REPOS_ROOT) path to dest. dir for placing chapterized files`,
    })
    .positional(`chStart`, {
      type: `number`,
      default: 1,
      describe: `number section at which numbered chapters begin`,
    });
};

export { default as handler } from './handler';
