#!/usr/bin/env node
require('@babel/register');
require('dotenv').config({ path: `${__dirname}/.env` });
const yargs = require('yargs');
const { omit } = require('lodash');
const publish = require('./src/publish').default;
const publishRef = require('./src/publish/ref').default;
const convert = require('./src/convert').default;
const chapterize = require('./src/chapterize').default;
const cover = require('./src/cover').default;

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
  .command(
    ['chapterize <file> <dest> <chStart>'],
    'convert docbook.xml to asciidoc',
    ({ positional }) => {
      positional('file', {
        type: 'string',
        describe: 'full filepath to adoc file to be chapterized',
      });
      positional('dest', {
        type: 'string',
        describe: 'relative (to DOCS_REPOS_ROOT) path to dest. dir for placing chapterized files',
      });
      positional('chStart', {
        type: 'number',
        describe: 'number section at which numbered chapters begin',
      });
    },
    ({ file, dest, chStart }) => chapterize(file, dest, chStart),
  )
  .command(
    ['cover'],
    'create a book cover',
    (args) => {
      const argv = omit(args.argv, '_', '$0', 'command');
      cover(argv);
    },
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
