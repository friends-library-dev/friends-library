// @flow
require('@babel/register');
const { getRefPrecursor } = require('./src/publish/ref/index');
const { prepare } = require('./src/publish/prepare');
const { getCss, getHtml } = require('./src/publish/pdf/manifest');
const { createCommand } = require('./src/publish/index');

module.exports = {
  getRefPrecursor,
  prepare,
  createCommand,
  pdf: {
    getCss,
    getHtml,
  },
};
