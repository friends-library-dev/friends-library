// @flow
import { quotify } from '@friends-library/asciidoc';
import { sync as glob } from 'glob';
import fs from 'fs-extra';

export default function quotifyDir(path: string) {
  const fullpath = `${process.cwd()}/${path}`;
  if (!fs.pathExistsSync(fullpath)) {
    throw new Error(`${fullpath} is not a dir.`);
  }

  let pattern = '*';
  if (process.argv.includes('--glob')) {
    pattern = process.argv[process.argv.indexOf('--glob') + 1];
  }

  const files = glob(`${fullpath}/**/${pattern}.adoc`);
  files.forEach(file => {
    const content = fs.readFileSync(file).toString();
    const quoted = quotify(content);
    fs.writeFileSync(file, quoted);
  });
}
