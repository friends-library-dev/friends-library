const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// $ node packages/kite/src/isbn/make-imgs.js
// @see https://github.com/metafloor/bwip-js

const scale = 3; // scale the image
const height = 16; // height of barcode
const prefix = '978-1-64476'; // all our ISBNs start with this
const url = 'http://bwipjs-api.metafloor.com/?bcid=isbn&includetext&guardwhitespace';

const suffixes = fs
  .readFileSync(path.resolve(__dirname, 'suffixes.txt'))
  .toString()
  .trim()
  .split('\n');

suffixes.forEach(suffix => {
  const isbn = `${prefix}-${suffix}`;
  const imgPath = path.resolve(__dirname, 'imgs', `${isbn}.png`);
  execSync(`curl -Ss "${url}&text=${isbn}&scale=${scale}&height=${height}" > ${imgPath}`);
});
