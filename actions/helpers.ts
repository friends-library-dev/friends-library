import fs from 'fs';

export function newOrModifiedFiles(): string[] {
  return ['files_modified.json', 'files_added.json']
    .map(basename => `${process.env.HOME}/${basename}`)
    .map(path => fs.readFileSync(path).toString())
    .flatMap(contents => JSON.parse(contents))
    .filter(file => file.endsWith('.adoc'));
}
