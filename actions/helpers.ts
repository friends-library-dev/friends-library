import fs from 'fs';

export function newOrModifiedFiles(): string[] {
  const { HOME = '' } = process.env;
  const all: string[] = JSON.parse(fs.readFileSync(`${HOME}/files.json`, 'utf8'));
  const rm: string[] = JSON.parse(fs.readFileSync(`${HOME}/files_removed.json`, 'utf8'));
  return all.filter(file => file.endsWith('.adoc')).filter(file => !rm.includes(file));
}
