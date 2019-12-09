import fs from 'fs';
import path from 'path';
import FsDocPrecursor from '../FsDocPrecursor';

export default function config(dpc: FsDocPrecursor): void {
  const configPath = path.resolve(dpc.fullPath, '..', 'config.json');
  if (fs.existsSync(configPath)) {
    dpc.config = JSON.parse(fs.readFileSync(configPath).toString());
  }
}
