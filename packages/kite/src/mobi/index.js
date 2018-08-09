// @flow
import { promisify } from 'util';
import fs from 'fs-extra';
import kindlegen from 'kindlegen';
import Zip from 'node-zip';
import { epub } from '../epub';
import type { SourceSpec, FileManifest, Command } from '../type';

const { execSync } = require('child_process');

const asyncKindlegen = promisify(kindlegen);

export function mobi(spec: SourceSpec, cmd: Command): FileManifest {
  const epubManifest = epub(spec, cmd);
  const mobiManifest = {};

  Object.keys(epubManifest).forEach(path => {
    mobiManifest[path] = epubManifest[path].replace(
      /<meta charset="UTF-8"\/>/gm,
      '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>',
    );
  });

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
  Object.keys(manifest).forEach(path => {
    zip.file(path, manifest[path]);
    fs.outputFileSync(`_publish/_src_/${filename}/mobi/${path}`, manifest[path]);
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const precursor = `_publish/${filename}.mobi.epub`;
  fs.writeFileSync(precursor, binary, 'binary');

  const buffer = await asyncKindlegen(fs.readFileSync(precursor));
  const file = `${filename}${perform ? '' : `-${Date.now()}`}`;
  fs.writeFileSync(`_publish/${file}.mobi`, buffer);
  fs.removeSync(precursor);

  if (open) {
    execSync(`open -a "/Applications/Kindle.app" "_publish/${file}.mobi"`);
  }

  return `${file}.mobi`;
}
