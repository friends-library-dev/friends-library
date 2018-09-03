#!/usr/bin/env node
require('@babel/register');
require('dotenv').config({ path: `${__dirname}/.env` });
const yargs = require('yargs');
const publish = require('./src/publish').default;
const publishRef = require('./src/publish/ref').default;
const convert = require('./src/convert').default;

// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    'publish:ref <path> [format]',
    'publish reference asciidoc document at given path',
    ({ positional }) => positional('path', {
      type: 'string',
      describe: 'relative filepath to reference doc (from project root)',
    }),
    timed(publishRef),
  )
  .command(
    ['publish <path> [format]', '$0'],
    'publish friends-library asciidoc documents at given path',
    ({ positional }) => positional('path', {
      type: 'string',
      describe: 'absolute filepath to root dir containing doc repos',
    }),
    timed(publish),
  )
  .command(
    ['convert <file>'],
    'convert docbook.xml to asciidoc',
    ({ positional }) => positional('file', {
      type: 'string',
      describe: 'full filepath to docbook xml file',
    }),
    ({ file }) => convert(file),
  )
  .help()
  .argv;


function timed(fn) {
  return (...args) => {
    const start = Date.now();
    fn(...args).then(() => {
      const stop = Date.now();
      console.log(`📗  Done in ${(stop - start) / 1000}s.`);
    });
  };
}
