import React from 'react';
import path from 'path';
import { flow } from 'lodash';
import { readFileSync, existsSync } from 'fs-extra';
import { sync as glob } from 'glob';
import { renderToStaticMarkup } from 'react-dom/server';
// @ts-ignore
import Asciidoctor from 'asciidoctor.js';
import { Html } from '@friends-library/types';
import Divider from '../components/Divider';
import EmbeddedAudio from '../components/EmbeddedAudio';
import { LANG } from '../env';

export function getPartials(): { [key: string]: Html } {
  const partials: { [key: string]: Html } = {};
  const files = glob(path.resolve(__dirname, '..', 'partials/*.en.adoc'));

  files.forEach(f => {
    let file = f;
    const slug = path.basename(file).replace(/\.e(n|s)\.adoc$/, '');
    const esFile = file.replace('.en.adoc', '.es.adoc');
    if (LANG === 'es' && existsSync(esFile)) {
      file = esFile;
    }
    partials[slug] = flow(
      readFileSync,
      // @ts-ignore
      src => Asciidoctor().convert(src),
      cleanAsciidoctor,
      replaceDividers,
      replaceEmbeddedAudio,
    )(file);
  });

  return partials;
}

const replaceDividers = (html: Html): Html =>
  html.replace('<Divider />', renderToStaticMarkup(<Divider />));

const replaceEmbeddedAudio = (html: Html): Html =>
  html.replace(
    /<EmbeddedAudio\s+id={(\d+)}\s+title="([^"]+)"(?:\s+)?\/>/,
    (_, id, title) =>
      renderToStaticMarkup(<EmbeddedAudio id={parseInt(id, 10)} title={title} />),
  );

const cleanAsciidoctor = (html: Html): Html => {
  return html
    .replace(/ class="hdlist1"/gm, '')
    .replace(/<dd>\s*<p>/gm, '<dd>')
    .replace(/<\/p>\s*<\dd>/gm, '</dd>')
    .replace(
      /<div class="paragraph(?: ([^"]+))?">\s*<p>/gm,
      (_, cls: string) => `<p${cls ? ` class="${cls}"` : ''}>`,
    )
    .replace(/<(\/)?div([^>]+)?>/gm, '')
    .replace(/ id="_([^"]+)"/gm, '');
};
