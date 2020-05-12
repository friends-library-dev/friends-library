import chalk from 'chalk';
import { LintResult } from '@friends-library/types';
import { red, green, grey, yellow } from '@friends-library/cli-utils/color';
import DirLints from './DirLints';

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

function printResult(result: LintResult, path: string, lines: string[]): void {
  console.log(`\n\n${chalk.cyan(result.rule)}: ${result.message}`);
  grey(`${path}:${result.line}${result.column === false ? '' : `:${result.column}`}`);

  if (['eof-newline', 'open-block', 'footnote-split-spacing'].includes(result.rule)) {
    if (result.fixable) {
      printIsFixable();
    }
    return;
  }

  if (result.column !== false) {
    yellow('v---'.padStart(result.column + 3));
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
      printIsFixable();
    }
    return;
  }

  if (line) {
    grey('[no recommendation]');
  }
}

function printIsFixable(): void {
  console.log(chalk.dim.cyan('Use `--fix` to automatically fix'));
}
