import chalk from 'chalk';

export { chalk as c };

export function red(...args: any[]): void {
  console.log(chalk.red(...args));
}

export function blue(...args: any[]): void {
  console.log(chalk.blue(...args));
}

export function yellow(...args: any[]): void {
  console.log(chalk.yellow(...args));
}

export function green(...args: any[]): void {
  console.log(chalk.green(...args));
}

export function magenta(...args: any[]): void {
  console.log(chalk.magenta(...args));
}

export function cyan(...args: any[]): void {
  console.log(chalk.cyan(...args));
}

export function gray(...args: any[]): void {
  console.log(chalk.gray(...args));
}

export function grey(...args: any[]): void {
  console.log(chalk.gray(...args));
}

export function bgRed(...args: any[]): void {
  console.log(chalk.bgRed(...args));
}

export function white(...args: any[]): void {
  console.log(...args);
}

export function log(...args: any[]): void {
  console.log(...args);
}
