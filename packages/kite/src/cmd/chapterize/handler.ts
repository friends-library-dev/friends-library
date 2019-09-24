import { requireEnv } from '@friends-library/types';
import { red } from '@friends-library/cli/color';
import fs from 'fs-extra';
import leftPad from 'left-pad';
import path from 'path';

const { KITE_DOCS_REPOS_ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');

interface ChapterizeOptions {
  file: string;
  dest: string;
  chStart: number;
}

export default function chapterize({ file, dest, chStart }: ChapterizeOptions): void {
  if (!fs.existsSync(file)) {
    red(`File ${file} does not exist!`);
    process.exit(1);
  }

  const destPath = path.resolve(KITE_DOCS_REPOS_ROOT, dest);
  fs.ensureDirSync(destPath);

  const adoc = fs
    .readFileSync(file)
    .toString()
    .trim();

  const parts = adoc.split(/(?<=\n)(?=== )/);
  const frontmatterParts = ['preface', 'forward', 'introduction'];
  const cmds: string[] = [];
  let chapterNum = 0;

  parts.forEach((part, index) => {
    const num = index + 1;
    const paddedNum = leftPad(num, 2, '0');
    let filename = `${paddedNum}-`;
    if (chapterNum || index + 1 === chStart) {
      filename += `chapter-${++chapterNum}.adoc`;
    } else {
      filename += `${frontmatterParts[index]}.adoc`;
    }
    fs.outputFileSync(`${destPath}/${filename}`, part);
    cmds.push(`mv ${filename} ${paddedNum}-FOOBAR.adoc`);
  });

  if (parts.length > 3) {
    fs.outputFileSync(`${destPath}/rename.sh`, cmds.join('\n'));
  }
}