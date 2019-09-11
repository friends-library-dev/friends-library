import { sync as glob } from 'glob';
import { Arguments } from 'yargs';
import env from '@friends-library/env';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as hydrate from '../../fs-precursor/hydrate';

interface MakeOptions {
  pattern: string;
  isolate?: number;
}

export default async function handler(argv: Arguments<MakeOptions>): Promise<void> {
  const { pattern, isolate } = argv;
  const dpcs = await getFsPrecursorsByPattern(pattern);
  dpcs.forEach(hydrate.meta);
  dpcs.forEach(hydrate.revision);
  dpcs.forEach(hydrate.config);
  dpcs.forEach(hydrate.customCode);
  dpcs.forEach(dpc => hydrate.asciidoc(dpc, isolate || undefined));
  console.log(dpcs[0].asciidoc);
}

function getFsPrecursorsByPattern(pattern?: string): FsDocPrecursor[] {
  const { DOCS_REPOS_ROOT } = env.require('DOCS_REPOS_ROOT');
  return glob(`${DOCS_REPOS_ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.includes(pattern))
    .map(path => path.replace(/\/$/, ''))
    .map(path => new FsDocPrecursor(path, path.replace(DOCS_REPOS_ROOT, '')));
}
