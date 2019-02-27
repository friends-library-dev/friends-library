require('@babel/register');
const lint = require('./src/lint').default;
const { quotify, quotifyLine } = require('./src/quotify');
const { splitLines, makeSplitLines, refMutate, refUnmutate } = require('./src/split');

module.exports = {
  lint,
  quotify,
  quotifyLine,
  splitLines,
  makeSplitLines,
  refMutate,
  refUnmutate,
};
