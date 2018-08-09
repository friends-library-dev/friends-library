// @flow
/* eslint-disable no-restricted-syntax, no-await-in-loop */
import fs from 'fs-extra';
import { defaults, omit } from 'lodash';
import { specsFromPath } from './specs';
import { epub, makeEpub } from '../epub';
import { mobi, makeMobi } from '../mobi';
import { pdf, makePdf } from '../pdf';
import { send } from './send';

const { execSync } = require('child_process');


export default async (command: Object) => {
  const cmd = defaults(omit(command, ['$0', '_', 'path']), {
    format: ['epub', 'mobi', 'pdf-web', 'pdf-print'],
    perform: false,
    check: false,
    open: false,
    send: false,
    email: null,
  });

  if (cmd.perform === true) {
    cmd.check = true;
  }

  if (typeof cmd.format === 'string') {
    cmd.format = [cmd.format];
  }

  fs.removeSync('_publish');
  fs.ensureDir('_publish');

  const specs = specsFromPath(command.path);

  const files = [];

  for (const spec of specs) {
    if (cmd.format.includes('epub')) {
      spec.target = 'epub';
      const manifest = epub(spec, cmd);
      files.push(await makeEpub(manifest, spec.filename, cmd));
      if (cmd.open) {
        execSync(`open -a "iBooks" _publish/${spec.filename}.epub`);
      }
    }

    if (cmd.format.includes('mobi')) {
      spec.target = 'mobi';
      const manifest = mobi(spec, cmd);
      files.push(await makeMobi(manifest, spec.filename, cmd));
    }

    if (cmd.format.includes('pdf-print')) {
      spec.target = 'pdf-print';
      const manifest = pdf(spec);
      makePdf(manifest, `${spec.filename}--(print)`, cmd);
      files.push(`${spec.filename}--(print).pdf`);
    }

    if (cmd.format.includes('pdf-web')) {
      spec.target = 'pdf-web';
      const manifest = pdf(spec);
      makePdf(manifest, spec.filename, cmd);
      files.push(`${spec.filename}.pdf`);
    }
  }

  if (cmd.send) {
    send(files, cmd);
  }
};
