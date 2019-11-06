import fs from 'fs';
import { sync as glob } from 'glob';
import FsDocPrecursor from '../FsDocPrecursor';

export default function asciidoc(dpc: FsDocPrecursor, isolate?: number): void {
  let pattern = '*';
  if (isolate) {
    pattern = `${isolate < 9 ? '0' : ''}${isolate}*`;
  }

  const asciidoc = glob(`${dpc.fullPath}/${pattern}.adoc`)
    .map(path => fs.readFileSync(path).toString())
    .join('\n');

  dpc.asciidoc = asciidoc;
}
