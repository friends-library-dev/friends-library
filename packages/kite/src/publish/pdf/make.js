// @flow
import fs from 'fs-extra';
import { resolve as pathResolve } from 'path';
import { spawn, exec } from 'child_process';
import type { Job } from '../../type';
import { getPdfManifest } from './manifest';

export function makePdf(job: Job): Promise<string> {
  const { spec, target, filename } = job;
  const manifest = getPdfManifest(job);
  const pubDir = pathResolve(__dirname, '../../../_publish');
  const dir = `${pubDir}/_src_/${spec.filename}/${target}`;
  const writeFiles = Promise.all(Object.keys(manifest).map(path => (
    fs.outputFile(`${dir}/${path}`, manifest[path])
  )));

  return writeFiles
    .then(() => {
      const src = `${dir}/book.html`;
      const prince = spawn('prince-books', [src]);
      return new Promise((resolve, reject) => {
        prince.stderr.on('data', data => {
          const str = data.toString().trim();
          if (str && !str.match(/^prince: warning: cannot fit footnote/)) {
            reject(new Error(str));
          }
        });
        prince.on('close', code => (
          code === 0 ? resolve() : reject(new Error('prince-books error'))
        ));
      });
    })
    .then(() => {
      return fs.move(`${dir}/book.pdf`, `${pubDir}/${filename}`);
    })
    .then(() => {
      if (job.cmd.open) {
        exec(`open "${pubDir}/${filename}"`);
      }
      return filename;
    });
}
