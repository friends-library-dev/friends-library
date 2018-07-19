// @flow
import { readFileSync } from 'fs';
import Asciidoctor from 'asciidoctor.js';
import { sync as glob } from 'glob';
import { basename } from 'path';
import { resolve } from './resolve';
import { epub, makeEpub } from '../epub';
import { mobi, makeMobi } from '../mobi';


function assemble(spec) {
  const adoc = glob(`${spec.path}/*.adoc`)
    .map(path => readFileSync(path).toString())
    .join('\n');

  const html = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
<meta charset="UTF-8"/></head><body>${Asciidoctor().convert(adoc)}</body></html>`
  .replace(/<hr>/gm, '<hr />')
  .replace(/<br>/gm, '<br />');

  return {
    ...spec,
    adoc,
    html,
  }
}

export default (path: string = ''): void => {
  const specs = resolve(path)
    .map(assemble)

  specs.forEach(spec => {
    // const manifest = epub(spec);
    // makeEpub(manifest);
    const manifest = mobi(spec);
    makeMobi(manifest);
  });
}

const spec = {
  path: '/foo/bar',
  friend: {},
  document: {},
  edition: {},
  revision: 'asdfkjsdflkj',
  adoc: '',
}

// function epub(
//   adoc: string,
//   filename: string,
//   revision: string,
// )
