#!/usr/bin/env node
require('ts-node').register({
  compilerOptions: {
    downlevelIteration: true,
  },
});
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { prettifyErrors } = require('@friends-library/cli/error');
const yargs = require('yargs');
const branch = require('./src/cmd/branch');
const status = require('./src/cmd/status');
const checkout = require('./src/cmd/checkout');
const commit = require('./src/cmd/commit');
const push = require('./src/cmd/push');
const dlete = require('./src/cmd/delete');
const sync = require('./src/cmd/sync');
const clone = require('./src/cmd/clone');

prettifyErrors();

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('yarn fell')
  .command(branch)
  .command(status)
  .command(checkout)
  .command(commit)
  .command(push)
  .command(sync)
  .command(clone)
  .command(dlete)
  .help().argv;
