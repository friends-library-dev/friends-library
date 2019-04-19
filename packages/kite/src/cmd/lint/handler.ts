import { Arguments } from 'yargs';
import { LintResult } from '@friends-library/types';
import { lintFixDir, lintDir, DirLints } from '@friends-library/asciidoc';
import { red, green, grey, yellow, cyan } from '@friends-library/cli/color';
import chalk from 'chalk';
import leftPad from 'left-pad';

type LintCommandOptions = {
  path: string;
  rules?: string[];
  exclude?: string[];
  fix: boolean;
  limit?: number;
};

export default function lintHandler(argv: Arguments<LintCommandOptions>) {
  const options = {
    lang: 'en' as const,
    ...(argv.rules ? { include: argv.rules } : {}),
    ...(argv.exclude ? { exclude: argv.exclude } : {}),
  };

  if (argv.fix) {
    const { unfixable, numFixed } = lintFixDir(argv.path, options);
    if (unfixable.count() === 0) {
      if (numFixed === 0) {
        green('0 lint violations found! 😊 \n');
      } else {
        green(`${numFixed}/${numFixed} lint violations fixed! 😊 \n`);
      }
      process.exit(0);
      return;
    }

    printLints(unfixable, argv.limit || false);
    if (numFixed > 0) {
      cyan(`\n\nFixed ${numFixed} lint violation/s. 👍`);
    }
    red(`Found ${unfixable.count()} un-fixable lint violation/s. 😬 `);
    process.exit(1);
  }

  const lints = lintDir(argv.path, options);
  if (lints.count() === 0) {
    green('0 lint violations found! 😊 \n');
    process.exit(0);
  }

  printLints(lints, argv.limit || false);
  const numFixable = lints.numFixable();
  red(`\n\nFound ${lints.count()} lint violation/s. 😬 `);
  if (numFixable > 0) {
    red(`${numFixable} are fixable with --fix. 👍`);
  }
  process.exit(1);
}

export function printLints(lints: DirLints, limit: false | number = false): void {
  let printed = 0;
  lints.toArray().forEach(([filepath, { lints: fileLints, adoc }]) => {
    if (limit && printed >= limit) {
      return;
    }
    const lines = adoc.split('\n');
    fileLints.forEach(lint => {
      if (limit && printed >= limit) {
        return;
      }

      printResult(lint, filepath, lines);
      printed++;
    });
  });
}

function printResult(result: LintResult, path: string, lines: string[]) {
  console.log(`\n\n${chalk.cyan(result.rule)}: ${result.message}`);
  grey(`${path}:${result.line}${result.column === false ? '' : `:${result.column}`}`);

  if (['eof-newline', 'unterminated-open-block'].includes(result.rule)) {
    return;
  }

  if (result.column !== false) {
    yellow(leftPad('∨---', result.column + 3, ' '));
  }

  const line = lines[result.line - 1];
  if (line) {
    red(line);
  }

  if (
    line &&
    lines[result.line] &&
    ['trailing-hyphen', 'dangling-possessive'].includes(result.rule)
  ) {
    red(lines[result.line]);
  }

  if (result.recommendation) {
    green(result.recommendation);
    if (result.fixable) {
      console.log(chalk.dim.cyan('Use `--fix` to automatically fix'));
    }
    return;
  }

  if (line) {
    grey('[no recommendation]');
  }
}
