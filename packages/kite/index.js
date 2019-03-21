// @flow
require('@babel/register');
const { getRefPrecursor } = require('./src/publish/ref/index');
const { getDocumentMeta, unstringifyJob, jobToJson } = require('./src/publish/job/utils');
const { getCss } = require('./src/publish/pdf/manifest');
const { makePdf } = require('./src/publish/pdf/make');
const { createCommand } = require('./src/publish/cli');
const { createJob, createSpec, createPrecursor } = require('./src/publish/job');

module.exports = {
  getRefPrecursor,
  createCommand,
  getDocumentMeta,
  unstringifyJob,
  jobToJson,
  pdf: {
    make: makePdf,
    getCss,
  },
};
