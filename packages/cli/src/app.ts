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
import * as isbns from './cmd/isbns';
import * as intake from './cmd/intake';
import * as audio from './cmd/audio';
import * as eachYml from './cmd/each-yml';
import * as eachAdoc from './cmd/each-adoc';
import * as publishRef from './cmd/make-ref';

prettifyErrors();

/* eslint-disable  @typescript-eslint/no-unused-expressions */
yargs
  .scriptName(`yarn fl`)
  // @ts-ignore
  .command(make)
  .command(cover)
  .command(coverWatch)
  .command(publish)
  .command(publishRef)
  .command(lint)
  .command(unusual)
  .command(isbns)
  .command(intake)
  .command(chapterize)
  .command(convert)
  .command(audio)
  .command(eachYml)
  .command(eachAdoc)
  .help().argv;
