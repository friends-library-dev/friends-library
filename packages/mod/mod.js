#!/usr/bin/env node
require('@babel/register');
const yargs = require('yargs');
const { modernize } = require('./src/modernize');


// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    ['modernize <pattern>', '$0'],
    'replace strings for all doc repos undergiven path',
    ({ positional }) => positional('pattern', {
      type: 'string',
      describe: 'file or glob pattern for modernization',
    }),
    ({ pattern }) => modernize(pattern),
  )
  .help()
  .argv;
