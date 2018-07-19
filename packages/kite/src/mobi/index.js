// @flow
import fs from 'fs-extra';
import kindlegen from 'kindlegen';
import { epub, makeEpub } from '../epub';
import type { SourceSpec, FileManifest } from '../type';

export function mobi(spec: SourceSpec): FileManifest {
  const epubManifest = epub(spec);
  let mobiManifest = {};
  for (let path in epubManifest) {
    mobiManifest[path] = epubManifest[path].replace(
      /<meta charset="UTF-8"\/>/gm,
      '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>'
    );
  }
  return mobiManifest;
}

export function makeMobi(manifest: FileManifest): void {
  makeEpub(manifest, true);
  kindlegen(fs.readFileSync('_publish/test.kf8.epub'), (err, mobi) => {
    fs.writeFileSync('_publish/test.mobi', mobi);
    process.exit();
  });
}
