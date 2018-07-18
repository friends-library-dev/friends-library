// @flow
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, existsSync } from 'fs';
import { flow } from 'lodash';
import type { Html } from 'type';
import { LANG } from 'env';
import Asciidoctor from 'asciidoctor.js';
import Divider from 'components/Divider';
import EmbeddedAudio from 'components/EmbeddedAudio';

const replaceDividers = (html: Html): Html => (
  html.replace(
    '<Divider />',
    renderToStaticMarkup(<Divider />),
  )
);

const replaceEmbeddedAudio = (html: Html): Html => (
  html.replace(
    /<EmbeddedAudio\s+id={(\d+)}\s+title="([^"]+)"(?:\s+)?\/>/,
    (_, id, title) => renderToStaticMarkup(<EmbeddedAudio id={parseInt(id, 10)} title={title} />),
  )
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

export function get(file: string): Html {
  let path = `src/content/${file}.${LANG}.adoc`;

  // fallback to english when spanish missing
  if (!existsSync(path) && LANG === 'es') {
    path = `src/content/${file}.en.adoc`;
  }

  return flow(
    readFileSync,
    src => Asciidoctor().convert(src),
    cleanAsciidoctor,
    replaceDividers,
    replaceEmbeddedAudio,
  )(path);
}
