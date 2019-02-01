// @flow
require('@babel/register');
const { getRefPrecursor } = require('./src/publish/ref/index');
const { prepare } = require('./src/publish/prepare');
const { getDocumentMeta } = require('./src/publish/precursors');
const { getCss, getHtml } = require('./src/publish/pdf/manifest');
const { makePdf } = require('./src/publish/pdf/make');
const { createCommand, resetPublishDir } = require('./src/publish/index');
const { epigraph } = require('./src/publish/frontmatter');

module.exports = {
  getRefPrecursor,
  prepare,
  createCommand,
  getDocumentMeta,
  epigraph,
  resetPublishDir,
  pdf: {
    make: makePdf,
    getCss,
    getHtml,
  },
};
