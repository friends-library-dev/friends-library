import '@friends-library/env/load';
import yargs from 'yargs';
import { prettifyErrors } from '@friends-library/cli-utils/error';
import * as make from './cmd/make';
import * as cover from './cmd/cover';
import * as coverWatch from './cmd/cover-watch';
import * as publish from './cmd/publish';
import * as lint from './cmd/lint';
import * as unusual from './cmd/unusual';
import * as convert from './cmd/convert';
import * as chapterize from './cmd/chapterize';

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
  .command(unusual)
  .command(chapterize)
  .command(convert)
  .help().argv;
