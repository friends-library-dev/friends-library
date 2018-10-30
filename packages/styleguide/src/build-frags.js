const fs = require('fs-extra');
const { sync: glob } = require('glob');
const path = require('path');
const chokidar = require('chokidar');
const { magenta } = require('chalk');
const {
  getRefPrecursor,
  prepare,
  pdf,
  createCommand,
} = require('@friends-library/kite');

const precursor = getRefPrecursor();
const adocGlob = path.resolve(__dirname, 'adoc/*.adoc');

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
      html: innerHtml(pdf.getHtml(job)),
      adoc,
    };
  });

  fs.writeFileSync(path.resolve(__dirname, '..', 'dist/pdf.css'), css);

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'dist/frags.json'),
    JSON.stringify(frags),
  );
  console.log(magenta('🚁  styleguide fragments regenerated'));
}


function normalizeAdoc(adoc) {
  if (adoc.match(/(^|\n)== /)) {
    return adoc;
  }

  return `== Generated\n\n${adoc}`;
}

function innerHtml(html) {
  return html
    .replace(/[\s\S]+?<div class="sect1/gim, '<div class="sect1')
    .replace('\n</body>\n</html>', '')
    .trim();
}
