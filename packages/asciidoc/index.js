// @flow
require('@babel/register');
const { lint, lintDir, lintFixDir, lintFix, DirLints } = require('./src/lint/index'); // api server needs `/index`
const { quotify, quotifyLine } = require('./src/quotify');
const { splitLines, makeSplitLines, refMutate, refUnmutate } = require('./src/split');

module.exports = {
  lint,
  lintFix,
  lintDir,
  lintFixDir,
  DirLints,
  quotify,
  quotifyLine,
  splitLines,
  makeSplitLines,
  refMutate,
  refUnmutate,
};
