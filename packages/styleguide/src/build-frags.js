const fs = require('fs-extra');
const {
  createJob,
  createSourceSpec,
  createPrecursor,
  embeddablePdfHtml,
  epigraph,
} = require('@friends-library/asciidoc');
const chalk = require('chalk');
const { sync: glob } = require('glob');
const path = require('path');
const chokidar = require('chokidar');
const { throttle } = require('lodash');

const notify = throttle(
  /* eslint-disable no-console */
  () => console.log(chalk.magenta('🚁  styleguide fragments regenerated')),
  5000,
);
const adocGlob = path.resolve(__dirname, 'adoc/*.adoc');

fs.ensureDir(path.resolve(__dirname, '..', 'dist/'));

if (process.argv.includes('--watch')) {
  chokidar
    .watch(adocGlob)
    .add(path.resolve(__dirname, '../../../kite/src/publish/*'))
    .on('all', regen);
} else {
  regen();
}

function regen() {
  const files = glob(adocGlob);
  const frags = {};

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

function normalizeAdoc(adoc) {
  if (adoc.match(/(^|\n)== /)) {
    return adoc;
  }

  return `== Generated\n\n${adoc}`;
}

function innerHtml(job) {
  return `${epigraph(job)}${embeddablePdfHtml(job)}`;
}
