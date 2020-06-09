import { sync as glob } from 'glob';
import env from '@friends-library/env';
import FsDocPrecursor from './FsDocPrecursor';

export function getByPattern(pattern?: string): FsDocPrecursor[] {
  const { DOCS_REPOS_ROOT } = env.require(`DOCS_REPOS_ROOT`);

  if (allFiles === undefined) {
    allFiles = glob(`${DOCS_REPOS_ROOT}/{es,en}/*/*/*/`);
  }

  return allFiles
    .filter(path => !pattern || path.includes(pattern))
    .map(path => path.replace(/\/$/, ``))
    .map(path => new FsDocPrecursor(path, path.replace(DOCS_REPOS_ROOT, ``)));
}

let allFiles: string[] | undefined;
