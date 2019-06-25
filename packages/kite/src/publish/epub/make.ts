import fs from 'fs-extra';
import Zip from 'node-zip';
import chalk from 'chalk';
import epubCheck, { Message } from 'epub-check';
import { Job, FileManifest, DocumentArtifacts } from '@friends-library/types';
import { getEpubManifest } from './manifest';
import { PUBLISH_DIR } from '../file';

export async function makeEpub(job: Job): Promise<DocumentArtifacts> {
  const manifest = await getEpubManifest(job);
  const artifacts = await writeEbookManifest(manifest, job);

  if (job.meta.check) {
    const check = await epubCheck(`${PUBLISH_DIR}/_src_/${job.spec.filename}/epub`);
    if (!check.pass) {
      logEpubCheckFail(job.filename, check.messages);
      process.exit(1);
    }
  }

  if (manifest['OEBPS/cover.png']) {
    fs.unlinkSync(manifest['OEBPS/cover.png']);
  }

  return artifacts;
}

export async function writeEbookManifest(
  manifest: FileManifest,
  job: Job,
): Promise<DocumentArtifacts> {
  const { spec, target } = job;
  const zip = new Zip();
  const promises = [];

  Object.keys(manifest).forEach(relPath => {
    const isImg = !!relPath.match(/\.(png|jpe?g)$/);
    const contents = isImg ? fs.readFileSync(manifest[relPath]) : manifest[relPath];
    const absPath = `${PUBLISH_DIR}/_src_/${spec.filename}/${target}/${relPath}`;
    zip.file(relPath, contents);
    promises.push(fs.outputFile(absPath, contents));
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const basename = `${spec.filename}${target === 'mobi' ? '.mobi' : ''}.epub`;
  promises.push(fs.writeFile(`${PUBLISH_DIR}/${basename}`, binary, 'binary'));
  await Promise.all(promises);
  return {
    filePath: `${PUBLISH_DIR}/${basename}`,
    srcDir: `${PUBLISH_DIR}/_src_/${spec.filename}/${target}`,
  };
}

function logEpubCheckFail(filename: string, warnings: Message[]): void {
  const simplified = warnings.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
  console.log(chalk.red(`EpubCheck failed for "${filename}" warnings below:`));
  console.log(chalk.red(JSON.stringify(simplified, null, 2)));
}
