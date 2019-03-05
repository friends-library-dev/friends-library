// @flow
/* istanbul ignore file */
import { lintPath } from '@friends-library/asciidoc';
import { red, green, grey, yellow, cyan } from '@friends-library/cli/color';
import chalk from 'chalk';
import leftPad from 'left-pad';
import fs from 'fs-extra';

export default function (path: string, argv: Object): void {
  const lints = lintPath(path, argv.rules || null, argv.exclude || null);
  if (lints.count() === 0) {
    green('0 lint violations found! 😊 \n');
    process.exit(0);
  }

  const clean = printLints(lints, argv.limit || false, argv.fix);
  process.exit(clean ? 0 : 1);
}

export function printLints(
  lints: any,
  limit: false | number,
  doFix: boolean = false,
): boolean {
  const total: number = lints.count();
  let numFixed = 0;

  let printed = 0;
  [...lints].forEach(([filepath, { lints: fileLints, adoc }]) => {
    if (limit && printed >= limit) {
      return;
    }
    if (doFix) {
      fix(filepath, fileLints);
    }
    const lines = adoc.split('\n');
    fileLints.forEach(lint => {
      if (limit && printed >= limit) {
        return;
      }

      if (lint.fixed === true) {
        numFixed++;
      }

      printResult(lint, filepath, lines);
      printed++;
    });
  });

  red(`\n\nFound ${total} lint violation/s. 😬 `);
  if (numFixed > 0) {
    cyan(`Fixed ${numFixed} lint violation/s. 👍`);
  }
  console.log('\n');
  return total - numFixed === 0;
}

function fix(path, results) {
  const lines = fs.readFileSync(path).toString().split('\n');
  const modifiedLines = new Set();
  results.forEach(result => {
    if (!result.fixable || modifiedLines.has(result.line)) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(result, 'recommendation')) {
      return;
    }

    // multi-line fix
    if (result.rule === 'trailing-hyphen' && !modifiedLines.has(result.line + 1)) {
      const [first, second] = result.recommendation.split('\n');
      lines[result.line - 1] = first;
      lines[result.line] = second;
      modifiedLines.add(result.line);
      modifiedLines.add(result.line + 1);
      result.fixed = true;
      return;
    }

    lines[result.line - 1] = result.recommendation;
    modifiedLines.add(result.line);
    result.fixed = true;
  });

  if (modifiedLines.size > 0) {
    fs.writeFileSync(path, lines.join('\n'));
  }
}

function printResult(result, path, lines) {
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
  if (line && result.rule === 'trailing-hyphen' && lines[result.line]) {
    red(lines[result.line]);
  }

  if (result.recommendation) {
    green(result.recommendation);
    if (result.fixed) {
      cyan('FIXED. 👍');
    } else if (result.fixable) {
      console.log(chalk.dim.cyan('Use `--fix` to automatically fix'));
    }
    return;
  }

  if (line) {
    grey('[no recommendation]');
  }
}
