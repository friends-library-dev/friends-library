import fs from 'fs';
import { sync as glob } from 'glob';
import FsDocPrecursor from '../FsDocPrecursor';
import { Asciidoc } from '@friends-library/types';

interface AsciidocMutator {
  (adoc: Asciidoc, path: string, idx: number): Asciidoc;
}

export default function asciidoc(
  dpc: FsDocPrecursor,
  isolate?: number,
  mutator?: AsciidocMutator,
): void {
  let pattern = `*`;
  if (isolate) {
    pattern = `${isolate < 10 ? `0` : ``}${isolate}*`;
  }

  const asciidoc = glob(`${dpc.fullPath}/${pattern}.adoc`)
    .map((path) => ({ path, adoc: fs.readFileSync(path).toString() }))
    .map(mutator ? ({ path, adoc }, idx) => mutator(adoc, path, idx) : ({ adoc }) => adoc)
    .join(`\n`);

  dpc.asciidoc = asciidoc;
}
