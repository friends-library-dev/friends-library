import '@friends-library/env/load';
import yargs from 'yargs';
import { prettifyErrors } from '@friends-library/cli-utils/error';
import * as make from './cmd/make';
import * as cover from './cmd/cover';
import * as coverWatch from './cmd/cover-watch';
import * as publish from './cmd/publish';
import * as lint from './cmd/lint';

prettifyErrors();

/* eslint-disable no-unused-expressions */
yargs
  .scriptName('yarn fl')
  // @ts-ignore
  .command(make)
  .command(cover)
  .command(coverWatch)
  .command(publish)
  .command(lint)
  .help().argv;
