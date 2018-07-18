// @flow
import { resolve } from 'path';
import fs from 'fs-extra';
import Zip from 'node-zip';
import type { FileManifest } from '../type';


export function make(manifest: FileManifest) {
  fs.removeSync('_publish');
  fs.ensureDir('_publish');
  const zip = new Zip();
  for (let path in manifest) {
    zip.file(path, manifest[path]);
  }
  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  fs.writeFileSync('_publish/test.epub', data, 'binary');
}
