import fs from 'fs';
import path from 'path';
import { sync as glob } from 'glob';
import { DocPrecursor } from '@friends-library/types';
import FsDocPrecursor from '../FsDocPrecursor';

export default function customCode(dpc: FsDocPrecursor): void {
  const docDir = path.resolve(dpc.fullPath, `..`);
  const files = glob(`${docDir}/*.{css,html}`);
  files.forEach(file => {
    const type = path.extname(file).replace(/^\./, ``) as 'css' | 'html';
    const target = path
      .basename(file)
      .replace(/\.(css|html)$/, ``) as keyof DocPrecursor['customCode']['css'];
    const content = fs.readFileSync(file).toString();
    dpc.customCode[type][target] = content;
  });
}
