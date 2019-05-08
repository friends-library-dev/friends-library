import { Asciidoc, FilePath, EditionType, Lang } from '@friends-library/types';
import { sync as glob } from 'glob';
import fs from 'fs';

export function filesFromPath(
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

export function editionTypeFromPath(path: string): EditionType | undefined {
  if (path.includes('/original/')) {
    return 'original';
  } else if (path.includes('/modernized/')) {
    return 'modernized';
  } else if (path.includes('/updated/')) {
    return 'updated';
  }
  return undefined;
}

export function langFromPath(path: string): Lang {
  return path.includes('/es/') || path.indexOf('es/') === 0 || path === 'es'
    ? 'es'
    : 'en';
}
