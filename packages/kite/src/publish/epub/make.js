// @flow
import { exec } from 'child_process';
import fs from 'fs-extra';
import Zip from 'node-zip';
import chalk from 'chalk';
import epubCheck from 'epub-check';
import type { Job, FileManifest } from '../../type';
import { getEpubManifest } from './manifest';

export function makeEpub(job: Job): Promise<string> {
  const manifest = getEpubManifest(job);
  return writeEbookManifest(manifest, job)
    .then(() => (job.cmd.check ? check(job.spec.filename) : null))
    .catch(messages => {
      logEpubCheckFail(job.filename, messages);
      process.exit(1);
    })
    .then(() => {
      if (job.cmd.open) {
        exec(`open -a "iBooks" _publish/${job.filename}`);
      }
    })
    .then(() => job.filename);
}

export function writeEbookManifest(manifest: FileManifest, job: Job): Promise<*> {
  const { spec, target } = job;
  const zip = new Zip();
  const promises = [];

  Object.keys(manifest).forEach(path => {
    zip.file(path, manifest[path]);
    promises.push(fs.outputFile(
      `_publish/_src_/${spec.filename}/${target}/${path}`,
      manifest[path],
    ));
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const basename = `${spec.filename}${target === 'mobi' ? '.mobi' : ''}.epub`;
  promises.push(fs.writeFile(`_publish/${basename}`, binary, 'binary'));
  return Promise.all(promises).then(() => basename);
}

function check(filename: string): Promise<*> {
  return new Promise((resolve, reject) => {
    epubCheck(`_publish/_src_/${filename}/epub`)
      .then(result => (result.pass ? resolve() : reject(result.messages)));
  });
}

function logEpubCheckFail(filename: string, warnings): void {
  const simplified = warnings.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
  console.log(chalk.red(`EpubCheck failed for "${filename}" warnings below:`));
  console.log(chalk.red(JSON.stringify(simplified, null, 2)));
}
