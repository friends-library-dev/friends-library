// @flow
import fs from 'fs-extra';
import { yellow } from '@friends-library/color';
import { spawn, exec } from 'child_process';
import type { Job } from '../../type';
import { getPdfManifest } from './manifest';
import { PUBLISH_DIR } from '../file';

export function makePdf(job: Job): Promise<string> {
  const { spec, target, filename } = job;
  const manifest = getPdfManifest(job);
  const dir = `${PUBLISH_DIR}/_src_/${spec.filename}/${target}`;
  const writeFiles = Promise.all(Object.keys(manifest).map(path => (
    fs.outputFile(`${dir}/${path}`, manifest[path])
  )));

  return writeFiles
    .then(() => {
      const src = `${dir}/book.html`;
      const prince = spawn('prince-books', [src]);
      let output = '';

      return new Promise((resolve, reject) => {
        prince.stderr.on('data', data => {
          output = output.concat(data.toString());
        });

        prince.on('close', code => {
          output = output
            .trim()
            .split('\n')
            .filter(filterPrinceOutput)
            .map(l => `  ${job.filename} -> ${l}`)
            .join('\n');

          if (output) {
            yellow(output);
          }

          return code === 0 ? resolve() : reject(new Error(`prince-books error ${code}`));
        });
      });
    })
    .then(() => {
      return fs.move(`${dir}/book.pdf`, `${PUBLISH_DIR}/${filename}`);
    })
    .then(() => {
      if (job.cmd.open) {
        exec(`open "${PUBLISH_DIR}/${filename}"`);
      }
      return filename;
    });
}


function filterPrinceOutput(line: string): boolean {
  if (line.trim() === '') {
    return false;
  }

  if (line.match(/^prince: warning: cannot fit footnote\(s\) on page/)) {
    return false;
  }

  return true;
}
