const fs = require('fs-extra');
const { getRefPrecursor, prepare, epigraph, pdf, createCommand } = require('@friends-library/kite');
const { magenta } = require('@friends-library/cli/color');
const { sync: glob } = require('glob');
const path = require('path');
const chokidar = require('chokidar');
const { throttle } = require('lodash');

const notify = throttle(() => magenta('🚁  styleguide fragments regenerated'), 5000);
const precursor = getRefPrecursor('misc');
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
  let css;

  files.forEach(file => {
    const adoc = normalizeAdoc(fs.readFileSync(file).toString());
    const spec = prepare({ ...precursor, adoc });
    const id = path.basename(file).replace(/\.adoc$/, '');
    const cmd = createCommand({ frontmatter: false });
    const job = {
      id,
      spec,
      cmd,
      target: 'pdf-print',
      filename: '_',
    };

    if (!css) {
      css = pdf.getCss(job);
    }

    frags[id] = {
      html: innerHtml(job),
      adoc,
    };
  });

  fs.writeFileSync(path.resolve(__dirname, '..', 'dist/pdf.css'), css);

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
  const main = pdf.getHtml(job)
    .replace(/[\s\S]+?<div class="sect1/gim, '<div class="sect1')
    .replace('\n</body>\n</html>', '')
    .trim();
  return `${epigraph(job)}${main}`;
}
