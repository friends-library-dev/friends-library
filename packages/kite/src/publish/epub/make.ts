import fs from 'fs-extra';
import Zip from 'node-zip';
import chalk from 'chalk';
import epubCheck, { Message } from 'epub-check';
import { Job, FileManifest, DocumentArtifacts } from '@friends-library/types';
import { getEpubManifest } from './manifest';
import { PUBLISH_DIR } from '../file';

export function makeEpub(job: Job): Promise<DocumentArtifacts> {
  const manifest = getEpubManifest(job);
  let artifacts: DocumentArtifacts;
  return writeEbookManifest(manifest, job)
    .then(ebookArtifacts => (artifacts = ebookArtifacts))
    .then(() => (job.meta.check ? check(job.spec.filename) : undefined))
    .catch((messages: Message[]) => {
      logEpubCheckFail(job.filename, messages);
      process.exit(1);
    })
    .then(() => artifacts);
}

export function writeEbookManifest(
  manifest: FileManifest,
  job: Job,
): Promise<DocumentArtifacts> {
  const { spec, target } = job;
  const zip = new Zip();
  const promises = [];

  Object.keys(manifest).forEach(path => {
    zip.file(path, manifest[path]);
    promises.push(
      fs.outputFile(
        `${PUBLISH_DIR}/_src_/${spec.filename}/${target}/${path}`,
        manifest[path],
      ),
    );
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const basename = `${spec.filename}${target === 'mobi' ? '.mobi' : ''}.epub`;
  promises.push(fs.writeFile(`${PUBLISH_DIR}/${basename}`, binary, 'binary'));
  return Promise.all(promises).then(() => ({
    filePath: `${PUBLISH_DIR}/${basename}`,
    srcDir: `${PUBLISH_DIR}/_src_/${spec.filename}/${target}`,
  }));
}

function check(filename: string): Promise<void | Message[]> {
  return new Promise((resolve, reject) => {
    epubCheck(`${PUBLISH_DIR}/_src_/${filename}/epub`).then(result =>
      result.pass ? resolve() : reject(result.messages),
    );
  });
}

function logEpubCheckFail(filename: string, warnings: Message[]): void {
  const simplified = warnings.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
  console.log(chalk.red(`EpubCheck failed for "${filename}" warnings below:`));
  console.log(chalk.red(JSON.stringify(simplified, null, 2)));
}
