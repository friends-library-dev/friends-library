import { CommandBuilder } from 'yargs';

export const command = `isbns`;

export const describe = `interact with our block of isbns`;

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .option(`next`, {
      type: `boolean`,
      describe: `print out the next unnassigned ISBN for usage`,
      default: false,
    })
    .option(`make-csv`, {
      type: `boolean`,
      describe: `make a .csv file for volunteer to use to enter info into bowker`,
      default: false,
    })
    .option(`make-images`, {
      type: `boolean`,
      describe: `make png images for each isbn number`,
      default: false,
    });
};

export { default as handler } from './handler';
