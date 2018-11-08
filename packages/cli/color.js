// @flow
const chalk = require('chalk');

function red(...args: Array<string>): void {
  console.log(chalk.red(...args));
}

function blue(...args: Array<string>): void {
  console.log(chalk.blue(...args));
}

function yellow(...args: Array<string>): void {
  console.log(chalk.yellow(...args));
}

function green(...args: Array<string>): void {
  console.log(chalk.green(...args));
}

function magenta(...args: Array<string>): void {
  console.log(chalk.magenta(...args));
}

function cyan(...args: Array<string>): void {
  console.log(chalk.cyan(...args));
}

function gray(...args: Array<string>): void {
  console.log(chalk.gray(...args));
}

function white(...args: Array<string>): void {
  console.log(...args);
}


module.exports = {
  red,
  blue,
  yellow,
  green,
  magenta,
  cyan,
  grey: gray,
  gray,
  white,
  log: white,
};
