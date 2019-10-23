import '@friends-library/env/load';
import yargs from 'yargs';
import { prettifyErrors } from '@friends-library/cli-utils/error';
import * as make from './cmd/make';
import * as cover from './cmd/cover';
import * as updatePages from './cmd/update-pages';

prettifyErrors();

/* eslint-disable no-unused-expressions */
yargs
  .scriptName('yarn fl')
  // @ts-ignore
  .command(make)
  .command(cover)
  .command(updatePages)
  .help().argv;
