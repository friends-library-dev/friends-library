// @flow
import Asciidoctor from 'asciidoctor.js';
import type { Asciidoc, Html } from '../type';

const asciidoctor = Asciidoctor();

export function convert(adoc: Asciidoc): Html {
  const html = asciidoctor.convert(adoc);
  return ((html: any): Html);
}

export function prepareAsciidoc(raw: Asciidoc): Asciidoc {
  return raw
    .replace(/\^\nfootnote:\[/igm, 'footnote:[')
    .replace(/"`/igm, '“')
    .replace(/`"/igm, '”')
    .replace(/'`/igm, '‘')
    .replace(/`'/igm, '’');
}
