import chalk from 'chalk';

export { chalk as c };

export function red(...args: any[]): void {
  console.log(chalk.red(...args));
}

red.dim = function (...args: any[]): void {
  console.log(chalk.red.dim(...args));
};

export function blue(...args: any[]): void {
  console.log(chalk.blue(...args));
}

blue.dim = function (...args: any[]): void {
  console.log(chalk.blue.dim(...args));
};

export function yellow(...args: any[]): void {
  console.log(chalk.yellow(...args));
}

yellow.dim = function (...args: any[]): void {
  console.log(chalk.yellow.dim(...args));
};

export function green(...args: any[]): void {
  console.log(chalk.green(...args));
}

green.dim = function (...args: any[]): void {
  console.log(chalk.green.dim(...args));
};

export function magenta(...args: any[]): void {
  console.log(chalk.magenta(...args));
}

magenta.dim = function (...args: any[]): void {
  console.log(chalk.magenta.dim(...args));
};

export function cyan(...args: any[]): void {
  console.log(chalk.cyan(...args));
}

cyan.dim = function (...args: any[]): void {
  console.log(chalk.cyan.dim(...args));
};

export function gray(...args: any[]): void {
  console.log(chalk.gray(...args));
}

gray.dim = function (...args: any[]): void {
  console.log(chalk.gray.dim(...args));
};

export function grey(...args: any[]): void {
  console.log(chalk.gray(...args));
}

grey.dim = function (...args: any[]): void {
  console.log(chalk.gray.dim(...args));
};

export function bgRed(...args: any[]): void {
  console.log(chalk.bgRed(...args));
}

export function white(...args: any[]): void {
  console.log(...args);
}

white.dim = function (...args: any[]): void {
  console.log(chalk.dim(...args));
};

export function log(...args: any[]): void {
  console.log(...args);
}

log.dim = function (...args: any[]): void {
  console.log(chalk.dim(...args));
};
