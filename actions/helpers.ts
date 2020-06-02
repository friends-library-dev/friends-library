import fs from 'fs';

export function newOrModifiedFiles(): string[] {
  console.log(
    'files:',
    JSON.parse(fs.readFileSync(`${process.env.HOME}/files.json`).toString()),
  );
  console.log(
    'files_added:',
    JSON.parse(fs.readFileSync(`${process.env.HOME}/files_added.json`).toString()),
  );
  console.log(
    'files_modified:',
    JSON.parse(fs.readFileSync(`${process.env.HOME}/files_modified.json`).toString()),
  );
  console.log(
    'files_removed:',
    JSON.parse(fs.readFileSync(`${process.env.HOME}/files_removed.json`).toString()),
  );
  return ['files_modified.json', 'files_added.json']
    .map(basename => `${process.env.HOME}/${basename}`)
    .map(path => fs.readFileSync(path).toString())
    .flatMap(contents => JSON.parse(contents))
    .filter(file => file.endsWith('.adoc'));
}
