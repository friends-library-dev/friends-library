// @flow
import { readFileSync } from 'fs';
import Asciidoctor from 'asciidoctor.js';
import { sync as glob } from 'glob';
import { basename } from 'path';
import { resolve } from './resolve';
import { epub, makeEpub } from '../epub';
import { mobi, makeMobi } from '../mobi';
import { printPdf, makePdf } from '../pdf';


function assemble(spec) {
  const adoc = glob(`${spec.path}/*.adoc`)
    .map(path => readFileSync(path).toString())
    .join('\n')
    .replace(/\^\nfootnote:\[/igm, 'footnote:[')
    .replace(/"`/igm, '“')
    .replace(/`"/igm, '”')
    .replace(/'`/igm, '‘')
    .replace(/`'/igm, '’'); // @TODO test all this...

  return {
    ...spec,
    adoc,
    html: Asciidoctor().convert(adoc),
  }
}

export default (path: string = ''): void => {
  const specs = resolve(path)
    .map(assemble)

  specs.forEach(spec => {
    const manifest = printPdf(spec);
    makePdf(manifest);
  });
}
