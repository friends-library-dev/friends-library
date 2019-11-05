import { Html, Asciidoc, DocSection, Css, DocPrecursor } from '@friends-library/types';
import { processDocument } from '@friends-library/adoc-convert';
import { paperbackInterior } from '@friends-library/doc-css';
import { replaceHeadings, epigraph } from '@friends-library/doc-html';
import fs from 'fs-extra';
import chalk from 'chalk';
import { sync as glob } from 'glob';
import path from 'path';
import chokidar from 'chokidar';
import { throttle } from 'lodash';

const notify = throttle(
  () => console.log(chalk.magenta('🚁  styleguide fragments regenerated')),
  5000,
);
const adocGlob = path.resolve(__dirname, 'adoc/*.adoc');

fs.ensureDir(path.resolve(__dirname, '..', 'dist/'));

if (process.argv.includes('--watch')) {
  chokidar.watch(adocGlob).on('all', regen);
} else {
  regen();
}

function getCss(): Css {
  const dpc: DocPrecursor = {
    lang: 'en',
    friendSlug: 'george-fox',
    friendInitials: ['G', 'F'],
    documentSlug: 'journal',
    path: 'en/george-fox/journal/original',
    documentId: '9414033c-4b70-4b4b-8e48-fec037822173',
    editionType: 'original',
    asciidoc: '',
    epigraphs: [],
    sections: [],
    paperbackSplits: [],
    blurb: '',
    notes: new Map(),
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: 'Journal of George Fox',
      author: { name: 'George Fox', nameSort: 'Fox, George' },
    },
    revision: { timestamp: Date.now(), sha: '', url: '' },
  };
  return paperbackInterior(dpc, {
    printSize: 'm',
    allowSplits: false,
    frontmatter: false,
    condense: false,
  });
}

function regen(): void {
  const files = glob(adocGlob);
  const frags: { [k: string]: { html: Html; adoc: Asciidoc } } = {};
  const css = getCss();
  fs.writeFileSync(path.resolve(__dirname, '../dist/pdf.css'), css);

  files.forEach(file => {
    const adoc = normalizeAdoc(fs.readFileSync(file).toString());
    const { sections, epigraphs } = processDocument(adoc);
    const id = path.basename(file).replace(/\.adoc$/, '');

    frags[id] = {
      html: `${epigraph({ epigraphs })}${html(sections)}`,
      adoc,
    };
  });

  fs.writeFileSync(path.resolve(__dirname, 'built-frags.json'), JSON.stringify(frags));
  notify();
}

function normalizeAdoc(adoc: Asciidoc): Asciidoc {
  if (adoc.match(/(^|\n)== /)) {
    return adoc;
  }

  return `== Generated\n\n${adoc}`;
}

function html(sections: DocSection[]): Html {
  return sections
    .map(({ html, heading }) => replaceHeadings(html, heading, { config: {} }))
    .join('\n');
}
