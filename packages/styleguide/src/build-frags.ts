import { Html, Asciidoc, Job } from '@friends-library/types';
import fs from 'fs-extra';
import {
  createJob,
  createSourceSpec,
  createPrecursor,
  embeddablePdfHtml,
  epigraph,
} from '@friends-library/asciidoc';
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

function regen(): void {
  const files = glob(adocGlob);
  const frags: { [k: string]: { html: Html; adoc: Asciidoc } } = {};

  files.forEach(file => {
    const adoc = normalizeAdoc(fs.readFileSync(file).toString());
    const precursor = createPrecursor({ adoc });
    const spec = createSourceSpec(precursor);
    const id = path.basename(file).replace(/\.adoc$/, '');
    const job = createJob({
      id,
      spec,
      meta: {
        frontmatter: false,
      },
      target: 'pdf-print',
    });

    frags[id] = {
      html: innerHtml(job),
      adoc,
    };
  });

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'dist/frags.json'),
    JSON.stringify(frags),
  );
  notify();
}

function normalizeAdoc(adoc: Asciidoc): Asciidoc {
  if (adoc.match(/(^|\n)== /)) {
    return adoc;
  }

  return `== Generated\n\n${adoc}`;
}

function innerHtml(job: Job): Html {
  return `${epigraph(job)}${embeddablePdfHtml(job)}`;
}
