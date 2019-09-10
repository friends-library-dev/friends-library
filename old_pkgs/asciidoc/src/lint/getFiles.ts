import fs from 'fs';
import { sync as glob } from 'glob';
import { Asciidoc, FilePath } from '@friends-library/types';

export function getFiles(
  path: FilePath,
): {
  path: FilePath;
  adoc: Asciidoc;
}[] {
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
