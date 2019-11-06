import '@friends-library/env/load';
import { prettifyErrors } from '@friends-library/cli-utils/error';
import yargs from 'yargs';
import * as branch from './cmd/branch';
import * as status from './cmd/status';
import * as checkout from './cmd/checkout';
import * as commit from './cmd/commit';
import * as push from './cmd/push';
import * as dlete from './cmd/delete';
import * as sync from './cmd/sync';
import * as clone from './cmd/clone';

prettifyErrors();

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('yarn fell')
  .command(branch)
  .command(status)
  .command(checkout)
  .command(commit)
  // @ts-ignore
  .command(push)
  .command(sync)
  .command(clone)
  .command(dlete)
  .help().argv;
