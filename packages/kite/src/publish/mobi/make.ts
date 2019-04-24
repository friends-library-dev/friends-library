import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { Job, DocumentArtifacts } from '@friends-library/types';
import { getMobiManifest } from './manifest';
import { writeEbookManifest } from '../epub/make';
import { PUBLISH_DIR } from '../file';

export function makeMobi(job: Job): Promise<DocumentArtifacts> {
  const manifest = getMobiManifest(job);
  return writeEbookManifest(manifest, job)
    .then(({ filePath }) => kindlegen(filePath, job))
    .catch(err => {
      console.log(chalk.red(`Error generating MOBI ${job.filename}:`));
      console.log(chalk.red(err));
      process.exit();
    })
    .then(() => ({
      filePath: `${PUBLISH_DIR}/${job.filename}`,
      srcDir: `${PUBLISH_DIR}/_src_/${job.spec.filename}/mobi`,
    }));
}

function kindlegen(precursorPath: string, job: Job): Promise<void> {
  const bin = path.resolve(
    path.dirname(require.main!.filename), // eslint-disable-line @typescript-eslint/no-non-null-assertion
    '../../../node_modules/kindlegen/bin/kindlegen',
  );

  const stream = spawn(bin, [precursorPath, '-c2', '-verbose', '-o', job.filename]);

  return new Promise((resolve, reject) => {
    let errors: string[] = [];
    stream.stdout.on('data', data => {
      const lines: string[] = data.toString().split('\n');
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
