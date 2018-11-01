// @flow
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import transform from './transform';
import prompt from './prompt';


export function modernize(pattern: string): void {
  if (!pattern.match(/\.adoc$/)) {
    pattern += '*.adoc';
  }
  const globPath = path.resolve(process.cwd(), pattern);
  const files = glob.sync(globPath);
  files.forEach(modernizeFile);
}

function modernizeFile(file: string): void {
  const before = fs.readFileSync(file).toString();
  transform(before, prompt).then(after => {
    if (before !== after) {
      fs.writeFileSync(file, after);
    }
  });
}
