// @flow
import fs from 'fs-extra';
import chalk from 'chalk';
import { resolve as pathResolve } from 'path';
import glob from 'glob';
import Prompt from 'prompt-sync';
import History from 'prompt-sync-history';
import { grey, log } from '@friends-library/color';

function clear() {
  process.stdout.write('\x1B[2J\x1B[0f');
}

const prompt = Prompt({
  sigint: true,
  history: History(),
});

// function complete(commands) {
//   return (str) => {
//     let i;
//     const ret = [];
//     for (i = 0; i < commands.length; i++) {
//       if (commands[i].indexOf(str) === 0) ret.push(commands[i]);
//     }
//     return ret;
//   };
// }

export default function replace(from: string, to: string, path: string): void {
  clear();
  const files = glob.sync(pathResolve(path, '**/*.adoc'));
  files.forEach(file => {
    let modified = false;
    const lines = fs.readFileSync(file).toString().split('\n');
    const updated = lines.map((line, index) => {
      const replaced = replaceLine(line, index, lines, file, from, to);
      if (replaced !== line) {
        modified = true;
      }
      return replaced;
    });
    if (modified) {
      fs.writeFileSync(file, updated.join('\n'));
    }
  });
}

function replaceLine(
  line: string,
  index: number,
  lines: Array<string>,
  file: string,
  from: string,
  to: string,
): string {
  if (line.indexOf(from) === -1) {
    return line;
  }

  log(`match: ${file.replace(`${process.cwd()}/`, '')}:${index + 1}`);
  grey(lines[index - 4] || '');
  grey(lines[index - 3] || '');
  grey(lines[index - 2] || '');
  grey(lines[index - 1] || '');
  const parts = line.split(from);
  console.log(`${parts[0]}${chalk.green(from)}${parts[1]}`);
  grey(lines[index + 1] || '');
  grey(lines[index + 2] || '');
  grey(lines[index + 3] || '');
  grey(lines[index + 4] || '');
  const response = prompt(`Replace with ${to}?`, true);
  clear();
  if (response === true) {
    return line.replace(from, to);
  }
  return line;
}
