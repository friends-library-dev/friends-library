require('@babel/register');
require('dotenv').config();
const publish = require('./src/publish').default;
const yargs = require('yargs');

yargs
  .command(
    ['publish <path> [format]', '$0'],
    'publish asciidoc documents at given path',
    ({ positional }) => positional('path', {
      type: 'string',
      describe: 'absolute filepath to root dir containing all doc repos'
    }),
    ({ path, format }) => publish(path, format)
  )
  .help()
  .argv;
