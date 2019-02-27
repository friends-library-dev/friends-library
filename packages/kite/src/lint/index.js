// @flow
import { lint } from '@friends-library/asciidoc';
import { red, green, grey } from '@friends-library/cli/color';
import chalk from 'chalk';
import fs from 'fs-extra';
import { sync as glob } from 'glob';
import type { Asciidoc, FilePath } from '../../../../type';

export default function (path: string): void {
  const files = getFiles(path);
  const resultsMap = new Map();
  files.forEach(file => resultsMap.set(file.path, lint(file.adoc)));

  const numViolations = [...resultsMap].reduce((num, [, results]) => num + results.length, 0);
  if (numViolations === 0) {
    green('0 lint violations found! 😊');
    process.exit(0);
  }

  [...resultsMap].forEach(([filepath, results]) => {
    const lines = (files.find(f => f.path === filepath) || { adoc: '' }).adoc.split('\n');
    results.forEach(result => printResult(result, filepath, lines));
  });
  red(`\nFound ${numViolations} lint violation/s. 😬 \n`);
  process.exit(1);
}


function printResult(result, path, lines) {
  console.log(`\n${chalk.cyan(result.rule)}: ${result.message}`);
  grey(`${path}:${result.line}${result.column === false ? '' : `:${result.column}`}`);

  if (result.rule === 'eof-newline') {
    return;
  }

  const line = lines[result.line - 1];
  if (line) {
    red(line);
  }

  if (result.recommendation) {
    green(result.recommendation);
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
