// @flow
import { basename } from 'path';
import fs from 'fs-extra';
import { resolve } from './resolve';
import { epub, makeEpub } from '../epub';
import { mobi, makeMobi } from '../mobi';
import { printPdf, makePdf } from '../pdf';


export default (path: string = '', formats: *) => {
  // @TODO bad usage of yargs but documentation is hard to grok...
  if (typeof formats === 'string') {
    formats = [formats];
  }

  if (formats == null || formats.length === 0) {
    formats = ['epub', 'mobi', 'pdf'];
  }

  fs.removeSync('_publish');
  fs.ensureDir('_publish');

  const specs = resolve(path);

  specs.forEach(async (spec) => {
    if (formats.includes('epub')) {
      const manifest = epub(spec);
      await makeEpub(manifest, spec.filename);
    }

    if (formats.includes('mobi')) {
      const manifest = mobi(spec);
      makeMobi(manifest, spec.filename);
    }

    if (formats.includes('pdf')) {
      const manifest = printPdf(spec);
      makePdf(manifest, spec.filename);
    }
  });
}
