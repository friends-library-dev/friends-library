require('@babel/register');
require('dotenv').config();
const yargs = require('yargs');
const publish = require('./src/publish').default;
const publishRef = require('./src/publish/ref').default;

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
  .help()
  .argv;


function timed(fn) {
  return (...args) => {
    const start = Date.now();
    fn(...args).then(() => {
      const stop = Date.now();
      console.log(`✨  Done in ${(stop - start) / 1000}s.`);
    });
  };
}
