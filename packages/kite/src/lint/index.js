// @flow
import { lint } from '@friends-library/asciidoc';
import { red, green, grey, yellow, cyan } from '@friends-library/cli/color';
import chalk from 'chalk';
import leftPad from 'left-pad';
import fs from 'fs-extra';
import { sync as glob } from 'glob';
import type { Asciidoc, FilePath } from '../../../../type';

export default function (path: string): void {
  const files = getFiles(path);
  const resultsMap = new Map();
  files.forEach(file => resultsMap.set(file.path, lint(file.adoc)));

  const numViolations = [...resultsMap].reduce((num, [, results]) => num + results.length, 0);
  if (numViolations === 0) {
    green('0 lint violations found! 😊 \n');
    process.exit(0);
  }

  let numFixed = 0;
  [...resultsMap].forEach(([filepath, results]) => {
    if (process.argv.includes('--fix')) {
      fix(filepath, results);
    }
    const lines = (files.find(f => f.path === filepath) || { adoc: '' }).adoc.split('\n');
    results.forEach(result => {
      if (result.fixed === true) {
        numFixed++;
      }
      printResult(result, filepath, lines);
    });
  });

  red(`\n\nFound ${numViolations} lint violation/s. 😬 `);
  if (numFixed > 0) {
    cyan(`Fixed ${numFixed} lint violation/s.  👍`);
  }
  console.log('\n');
  process.exit(numViolations - numFixed === 0 ? 0 : 1);
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

  if (result.column) {
    yellow(leftPad('∨---', result.column + 3, ' '));
  }

  const line = lines[result.line - 1];
  if (line) {
    red(line);
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

type File = {|
  path: FilePath,
  adoc: Asciidoc,
|};

function getFiles(path): Array<File> {
  let files;
  if (path.match(/\.adoc$/)) {
    if (!fs.existsSync(path)) {
      throw new Error(`<path> ${path} does not exist.`);
    }
    files = [path];
  } else {
    files = glob(`${path}/**/*.adoc`);
    if (files.length === 0) {
      throw new Error(`No files globbed from <path>: ${path}`);
    }
  }

  // temp
  files = files.filter(file => file.indexOf('thomas-story') === -1);

  return files.map(file => ({
    path: file,
    adoc: fs.readFileSync(file).toString(),
  }));
}
