// @flow
import fs from 'fs-extra';
import path from 'path';
import { exec, spawn } from 'child_process';
import chalk from 'chalk';
import type { Job } from '../../type';
import { getMobiManifest } from './manifest';
import { writeEbookManifest } from '../epub/make';

export function makeMobi(job: Job): Promise<string> {
  const manifest = getMobiManifest(job);
  return writeEbookManifest(manifest, job)
    .then(precursor => kindlegen(precursor, job))
    .catch(err => {
      console.log(chalk.red(`Error generating MOBI ${job.filename}:`));
      console.log(chalk.red(err));
      process.exit();
    })
    .then(() => {
      if (job.cmd.open) {
        exec(`open -a "/Applications/Kindle.app" _publish/${job.filename}`);
      }
    })
    .then(() => job.filename);
}

function kindlegen(precursor: string, job: Job): Promise<*> {
  const precursorPath = `_publish/${precursor}`;
  const stream = spawn(
    `${path.dirname(require.main.filename)}/node_modules/kindlegen/bin/kindlegen`,
    [precursorPath, '-c2', '-verbose', '-o', job.filename],
  );

  return new Promise((resolve, reject) => {
    let errors = [];
    stream.stdout.on('data', data => {
      const lines = data.toString().split('\n');
      errors = errors.concat(lines.filter(l => l.match(/^Error/)));
    });

    stream.on('close', code => {
      if ([0, 1, 2].includes(code) === false || errors.length) {
        const errorsString = errors.length ? `\n${errors.join('\n')}` : '';
        reject(new Error(`kindlegen returned code ${code}${errorsString}`));
        return;
      }

      fs.remove(precursorPath);
      resolve();
    });
  });
}
