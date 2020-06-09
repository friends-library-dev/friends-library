import { Html, Asciidoc } from '@friends-library/types';
import { processDocument } from '@friends-library/adoc-convert';
import { genericPaperbackInterior } from '@friends-library/doc-css';
import { webHtml, epigraph } from '@friends-library/doc-html';
import fs from 'fs-extra';
import chalk from 'chalk';
import { sync as glob } from 'glob';
import path from 'path';
import chokidar from 'chokidar';
import { throttle } from 'lodash';

const notify = throttle(
  () => console.log(chalk.magenta(`🚁  styleguide fragments regenerated`)),
  5000,
);
const adocGlob = path.resolve(__dirname, `adoc/*.adoc`);

fs.ensureDir(path.resolve(__dirname, `..`, `dist/`));

if (process.argv.includes(`--watch`)) {
  chokidar.watch(adocGlob).on(`all`, regen);
} else {
  regen();
}

function regen(): void {
  fs.writeFileSync(
    path.resolve(__dirname, `../dist/paperback-interior.css`),
    genericPaperbackInterior(),
  );

  const files = glob(adocGlob);
  const frags: { [k: string]: { html: Html; adoc: Asciidoc } } = {};

  files.forEach(file => {
    const adoc = normalizeAdoc(fs.readFileSync(file).toString());
    const { sections, epigraphs } = processDocument(adoc);
    const id = path.basename(file).replace(/\.adoc$/, ``);

    frags[id] = {
      html: `${epigraph({ epigraphs })}${webHtml(sections)}`,
      adoc,
    };
  });

  fs.writeFileSync(path.resolve(__dirname, `built-frags.json`), JSON.stringify(frags));
  notify();
}

function normalizeAdoc(adoc: Asciidoc): Asciidoc {
  if (adoc.match(/(^|\n)== /)) {
    return adoc;
  }

  return `== Generated\n\n${adoc}`;
}
