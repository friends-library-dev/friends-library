require('@babel/register');
require('dotenv').config();
const yargs = require('yargs');
const publish = require('./src/publish').default;

// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    ['publish <path> [format]', '$0'],
    'publish asciidoc documents at given path',
    ({ positional }) => positional('path', {
      type: 'string',
      describe: 'absolute filepath to root dir containing all doc repos',
    }),
    publish,
  )
  .help()
  .argv;
