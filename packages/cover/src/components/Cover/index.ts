import fs from 'fs';

export function coverAsset(path: string): string {
  const fullpath = `${__dirname}/${path}`;
  if (!fs.existsSync(fullpath)) {
    throw new Error(`${fullpath} does not exist!`);
  }
  return fs.readFileSync(fullpath, 'binary').toString();
}

export { coverCss } from './css';
export { default as Cover } from './Cover';
