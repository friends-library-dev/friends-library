// @flow
import { resolve } from 'path';
import fs from 'fs-extra';
import Zip from 'node-zip';
import type { FileManifest } from '../type';


export function make(
  manifest: FileManifest,
  filename: string
): void {
  const zip = new Zip();
  for (let path in manifest) {
    zip.file(path, manifest[path]);
    fs.outputFileSync(`_publish/_src_/${filename}/epub/${path}`, manifest[path]);
  }

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  fs.writeFileSync(`_publish/${filename}.epub`, binary, 'binary');
}
