// @flow
import fs from 'fs-extra';
import leftPad from 'left-pad';
import path from 'path';
import { red } from '@friends-library/color';

const { env: { DOCS_REPOS_ROOT } } = process;

const fm = ['preface', 'forward', 'introduction'];

export default function chapterize(file: string, dest: string, chStart: number = 1): void {
  if (!fs.existsSync(file)) {
    red(`File ${file} does not exist!`);
    process.exit(1);
  }

  const destPath = path.resolve(DOCS_REPOS_ROOT || '', dest);
  fs.ensureDirSync(destPath);

  const adoc = fs.readFileSync(file).toString().trim();
  const parts = adoc.split(/(?=== )/);

  const cmds = [];
  let chapterNum = 0;

  parts.forEach((part, index) => {
    const num = index + 1;
    const paddedNum = leftPad(num, 2, '0');
    let filename = `${paddedNum}-`;
    if (chapterNum || (index + 1) === chStart) {
      filename += `chapter-${++chapterNum}.adoc`;
    } else {
      filename += `${fm[index]}.adoc`;
    }
    fs.outputFileSync(`${destPath}/${filename}`, part);
    cmds.push(`mv ${filename} ${paddedNum}-FOOBAR.adoc`);
  });
  fs.outputFileSync(`${destPath}/rename.sh`, cmds.join('\n'));
}
