#!/usr/bin/env node
require('@babel/register');
const yargs = require('yargs');
const { omit } = require('lodash');
const replace = require('./src/replace').default;
const git = require('./src/git');

// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    'replace [from] [to] [path]',
    'replace strings for all doc repos undergiven path',
    ({ positional }) => {
      positional('from', {
        type: 'string',
        describe: 'search for this string',
      });
      positional('to', {
        type: 'string',
        describe: 'replace instances with this string',
      });
      positional('path', {
        type: 'string',
        describe: 'relative filepath to dir containing repos to search in',
      });
    },
    ({ from, to, path }) => replace(from, to, path),
  )
  .command(
    'git [command]',
    'git all the repos!',
    ({ positional }) => positional('command', {
      type: 'string',
      describe: 'the git command',
    }),
    (args) => {
      const { command } = args;
      const argv = omit(args, '_', '$0', 'command');
      git[`git${command.charAt(0).toUpperCase()}${command.slice(1)}`](argv);
    },
  )
  .help()
  .argv;
