// @flow
import { promisify } from 'util';
import fs from 'fs-extra';
const { execSync } = require('child_process');
import kindlegen from 'kindlegen';
import { epub, makeEpub } from '../epub';
import Zip from 'node-zip';
import type { SourceSpec, FileManifest, Command } from '../type';

const asyncKindlegen = promisify(kindlegen);

export function mobi(spec: SourceSpec, cmd: Command): FileManifest {
  const epubManifest = epub(spec, cmd);
  let mobiManifest = {};
  for (let path in epubManifest) {
    mobiManifest[path] = epubManifest[path].replace(
      /<meta charset="UTF-8"\/>/gm,
      '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>'
    );
  }

  mobiManifest['OEBPS/package-document.opf'] = mobiManifest['OEBPS/package-document.opf'].replace(
    '<dc:identifier id="pub-id">friends-library/epub/',
    '<dc:identifier id="pub-id">friends-library/mobi/',
  );

  return mobiManifest;
}

export async function makeMobi(
  manifest: FileManifest,
  filename: string,
  { open, perform }: Command,
): Promise<string> {
  const zip = new Zip();
  for (let path in manifest) {
    zip.file(path, manifest[path]);
    fs.outputFileSync(`_publish/_src_/${filename}/mobi/${path}`, manifest[path]);
  }

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const precursor = `_publish/${filename}.mobi.epub`;
  fs.writeFileSync(precursor, binary, 'binary');

  const mobi = await asyncKindlegen(fs.readFileSync(precursor))
  const file = `${filename}${perform ? '' : `-${Date.now()}`}`;
  fs.writeFileSync(`_publish/${file}.mobi`, mobi);
  fs.removeSync(precursor);
  open && execSync(`open -a "/Applications/Kindle.app" "_publish/${file}.mobi"`);
  return `${file}.mobi`;
}
