import '@friends-library/client/load-env';
import { prettifyErrors } from '@friends-library/cli/error';
import yargs from 'yargs';
import * as publish from './cmd/publish';
import * as publishRef from './cmd/publish-ref';
import * as lint from './cmd/lint';
import * as takeApi from './cmd/take-api';
import * as convert from './cmd/convert';
import * as chapterize from './cmd/chapterize';
import * as cover from './cmd/cover';
import * as coverWatch from './cmd/cover-watch';
import * as unusual from './cmd/unusual';

prettifyErrors();

/* eslint-disable no-unused-expressions */
yargs
  .scriptName('yarn kite')
  // @ts-ignore
  .command(publish)
  .command(publishRef)
  .command(lint)
  .command(takeApi)
  .command(convert)
  .command(chapterize)
  .command(cover)
  .command(coverWatch)
  .command(unusual)
  .help().argv;
