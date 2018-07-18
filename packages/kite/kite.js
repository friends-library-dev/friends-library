require('@babel/register');
require('dotenv').config();
const publish = require('./src/publish').default;
const yargs = require('yargs');

yargs
  .command(
    'publish [path]',
    'publish asciidoc documents at given path',
    ({ positional }) => positional('file', {
      type: 'string',
      describe: 'absolute filepath to root dir containing all doc repos'
    }),
    ({ path }) => publish(path)
  )
  .help()
  .argv;
