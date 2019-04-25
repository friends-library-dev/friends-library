import fs from 'fs';

export function coverCss(): string {
  return fs.readFileSync(`${__dirname}/Cover.css`, 'UTF-8');
}

export function coverAsset(path: string): string {
  const fullpath = `${__dirname}/assets/${path}`;
  if (!fs.existsSync(fullpath)) {
    throw new Error(`${fullpath} does not exist!`);
  }
  return fs.readFileSync(fullpath).toString();
}

export { default as Cover } from './Cover';
