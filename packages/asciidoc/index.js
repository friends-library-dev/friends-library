require('@babel/register');
const { lint, lintPath } = require('./src/lint');
const { quotify, quotifyLine } = require('./src/quotify');
const { splitLines, makeSplitLines, refMutate, refUnmutate } = require('./src/split');

module.exports = {
  lint,
  lintPath,
  quotify,
  quotifyLine,
  splitLines,
  makeSplitLines,
  refMutate,
  refUnmutate,
};
