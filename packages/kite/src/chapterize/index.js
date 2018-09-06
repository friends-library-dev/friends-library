// @flow
import fs from 'fs-extra';
import leftPad from 'left-pad';
import path from 'path';
import { red } from '@friends-library/color';

const { env: { DOCS_REPOS_ROOT } } = process;

export default function chapterize(file: string, dest: string): void {
  if (!fs.existsSync(file)) {
    red(`File ${file} does not exist!`);
    process.exit(1);
  }

  const destPath = path.resolve(DOCS_REPOS_ROOT || '', dest);
  fs.ensureDirSync(destPath);

  const adoc = fs.readFileSync(file).toString().trim();
  const parts = adoc.split(/(?=== )/);

  const cmds = [];
  parts.forEach((part, index) => {
    const num = index + 1;
    const paddedNum = leftPad(num, 2, '0');
    const filename = `${paddedNum}-chapter-${num}.adoc`;
    fs.outputFileSync(`${destPath}/${filename}`, part);
    cmds.push(`mv ${filename} ${paddedNum}-FOOBAR.adoc`);
  });
  fs.outputFileSync(`${destPath}/rename.sh`, cmds.join('\n'));
}
