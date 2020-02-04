import fs from 'fs';
import { spawn, execSync } from 'child_process';
import { c, log, red } from '@friends-library/cli-utils/color';
import { ISBN } from '@friends-library/types';
import { getAllFriends } from '@friends-library/friends';
import isbns from './isbns.json';

const flags = ['next', 'makeImages', 'makeCsv'] as const;

type Argv = { [k in typeof flags[number]]: boolean };

export default function handler(argv: Argv): void {
  if (!flags.some(f => argv[f])) {
    const optionList = flags.map(optionify).join(' ');
    log(c`\n{red Supply at least one option:} {green ${optionList}}\n`);
    process.exit(1);
  }

  argv.next && next();
  argv.makeImages && makeImgs();
  argv.makeCsv && makeCsv();
}

function makeCsv(): void {
  const editions = [...getAllFriends('en', true), ...getAllFriends('es', true)]
    .flatMap(friend => friend.documents)
    .flatMap(document => document.editions);

  const rows: [string, string, string, string, string, string][] = [
    ['ISBN', 'Title', 'Author Last', 'Author First', 'Editor Last', 'Editor First'],
  ];

  editions.forEach(edition => {
    const document = edition.document;
    const [authorFirst, authorLast = ''] = splitName(document.friend.name);
    const [editorFirst, editorLast = ''] = splitName(edition.editor || '');
    rows.push([
      edition.isbn,
      edition.type === 'original'
        ? document.title
        : `${document.title} (${edition.type})`,
      authorLast,
      authorFirst === 'Compilations' || authorFirst === 'Compilaciones'
        ? ''
        : authorFirst,
      editorLast,
      editorFirst,
    ]);
  });

  console.table(rows);
  fs.writeFileSync(`${__dirname}/isbns.csv`, toCsvString(rows));
  log(c`\nCSV file written at: {magenta ${__dirname}/isbns.csv}\n`);
}

function next(): void {
  const used: ISBN[] = [];
  [...getAllFriends('en', true), ...getAllFriends('es', true)].forEach(friend => {
    friend.documents.forEach(doc => {
      doc.editions.forEach(edition => used.push(edition.isbn));
    });
  });

  for (let isbn of isbns) {
    if (!used.includes(isbn)) {
      const pbcopy = spawn('pbcopy');
      pbcopy.stdin.write(isbn);
      pbcopy.stdin.end();
      log(c`\nNext ISBN is: {green ${isbn}}  {gray (also copied to clipboard)}\n`);
      return;
    }
  }

  red('All ISBNs used!');
}

function makeImgs(): void {
  const url = 'http://bwipjs-api.metafloor.com/?bcid=isbn&includetext&guardwhitespace';
  const imgDir = `${process.cwd()}/packages/cover-web-app/public/images/isbn/`;
  isbns.forEach(isbn => {
    execSync(`curl -Ss "${url}&text=${isbn}&scale=3&height=16" > ${imgDir}/${isbn}.png`);
  });
}

function toCsvString(rows: string[][]): string {
  return rows
    .map(row => row.map(col => (col.includes(',') ? `"${col}"` : col)).join(','))
    .join('\n');
}

function optionify(str: string): string {
  return `--${str.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

function splitName(name: string): string[] {
  return name
    .split('')
    .reverse()
    .join('')
    .replace(' ', '*')
    .split('')
    .reverse()
    .join('')
    .split('*');
}
