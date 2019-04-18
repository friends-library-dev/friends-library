import fs from 'fs';
import { sync as glob } from 'glob';
import { Asciidoc, FilePath, LintOptions } from '@friends-library/types';
import lint from './lint';
import DirLints from './dir-lints';

export default function lintPath(
  path: FilePath,
  options: LintOptions = { lang: 'en' },
): DirLints {
  const files = getFiles(path);
  const lints = new DirLints();
  files.forEach(file =>
    lints.set(file.path, {
      lints: lint(file.adoc, options),
      adoc: file.adoc,
    }),
  );
  return lints;
}

function getFiles(
  path: FilePath,
): Array<{
  path: FilePath;
  adoc: Asciidoc;
}> {
  let files;
  if (path.match(/\.adoc$/)) {
    if (!fs.existsSync(path)) {
      throw new Error(`<path> ${path} does not exist.`);
    }
    files = [path];
  } else {
    files = glob(`${path.replace(/\/$/, '')}/**/*.adoc`);
    if (files.length === 0) {
      throw new Error(`No files globbed from <path>: ${path}`);
    }
  }

  return files.map(file => ({
    path: file,
    adoc: fs.readFileSync(file).toString(),
  }));
}
