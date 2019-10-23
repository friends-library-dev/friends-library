// @ts-ignore
import Zip from 'node-zip';
// @ts-ignore
import epubCheck from 'epub-check';
import fs from 'fs-extra';
import { FileManifest } from '@friends-library/types';
import { dirs } from './dirs';
import { EbookOptions } from './types';
import { red } from '@friends-library/cli-utils/color';

export async function writeEbookManifest(
  manifest: FileManifest,
  filenameNoExt: string,
  opts: EbookOptions,
  ebookType: 'epub' | 'mobi',
): Promise<string> {
  const { ARTIFACT_DIR, SRC_DIR } = dirs(opts);
  fs.ensureDirSync(SRC_DIR);

  const zip = new Zip();
  const promises: Promise<any>[] = [];

  Object.keys(manifest).forEach(path => {
    zip.file(path, manifest[path]);
    promises.push(fs.outputFile(`${SRC_DIR}/${path}`, manifest[path]));
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const basename = `${filenameNoExt}${ebookType === 'mobi' ? '.mobi' : ''}.epub`;
  const epubPath = `${ARTIFACT_DIR}/${basename}`;
  promises.push(fs.writeFile(epubPath, binary, 'binary'));
  await Promise.all(promises);

  if (opts.check && ebookType === 'epub') {
    const check = await epubCheck(SRC_DIR);
    if (!check.pass) {
      logEpubCheckFail(basename, check.messages);
      process.exit(1);
    }
  }

  return epubPath;
}

function logEpubCheckFail(filename: string, warnings: any[]): void {
  const simplified = warnings.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
  red(`EpubCheck failed for "${filename}" warnings below:`);
  red(JSON.stringify(simplified, null, 2));
}
