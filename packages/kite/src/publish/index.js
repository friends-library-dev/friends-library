// @flow
const { execSync } = require('child_process');
import { basename } from 'path';
import fs from 'fs-extra';
import { defaults, omit } from 'lodash';
import { resolve } from './resolve';
import { epub, makeEpub } from '../epub';
import { mobi, makeMobi } from '../mobi';
import { printPdf, makePdf } from '../pdf';


export default (cmd: Object) => {
  const path = cmd.path;
  cmd = defaults(omit(cmd, ['$0', '_', 'path']), {
    format: ['epub', 'mobi', 'pdf'],
    perform: false,
    check: false,
    open: false,
  });

  if (cmd.perform === true) {
    cmd.check = true;
  }

  if (typeof cmd.format === 'string') {
    cmd.format = [cmd.format];
  }

  fs.removeSync('_publish');
  fs.ensureDir('_publish');

  const specs = resolve(path);

  specs.forEach(async (spec) => {
    if (cmd.format.includes('epub')) {
      spec.target = 'epub';
      const manifest = epub(spec, cmd);
      await makeEpub(manifest, spec.filename, cmd);
      cmd.open && execSync(`open -a "iBooks" _publish/${spec.filename}.epub`);
    }

    if (cmd.format.includes('mobi')) {
      spec.target = 'mobi';
      const manifest = mobi(spec, cmd);
      makeMobi(manifest, spec.filename, cmd);
    }

    if (cmd.format.includes('pdf')) {
      spec.target = 'pdf';
      const manifest = printPdf(spec);
      makePdf(manifest, spec.filename);
    }
  });
}
