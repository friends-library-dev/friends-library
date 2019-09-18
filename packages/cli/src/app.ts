import '@friends-library/env/load';
import yargs from 'yargs';
import { prettifyErrors } from '@friends-library/cli-utils/error';
import * as make from './cmd/make';
// import * as publish from './cmd/publish';
// import * as publishRef from './cmd/publish-ref';
// import * as lint from './cmd/lint';
// import * as convert from './cmd/convert';
// import * as chapterize from './cmd/chapterize';
// import * as cover from './cmd/cover';
// import * as coverWatch from './cmd/cover-watch';
// import * as unusual from './cmd/unusual';
// import * as update from './cmd/update';
// import * as pagesData from './cmd/pages-data';
console.log('in here!');
prettifyErrors();

/* eslint-disable no-unused-expressions */
yargs
  .scriptName('yarn fl')
  .command(make)
  .help().argv;
