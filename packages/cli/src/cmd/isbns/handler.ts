import fs from 'fs';
import { spawn } from 'child_process';
import { c, log, red } from '@friends-library/cli-utils/color';
import { ISBN } from '@friends-library/types';
import { getAllFriends } from '@friends-library/friends';

interface Argv {
  next: boolean;
}

export default function handler({ next }: Argv): void {
  if (!next) {
    red('Currently `--next` is the only supported option');
    process.exit(1);
  }

  const used: ISBN[] = [];
  [...getAllFriends('en', true), ...getAllFriends('es', true)].forEach(friend => {
    friend.documents.forEach(doc => {
      doc.editions.forEach(edition => used.push(edition.isbn));
    });
  });

  const all: ISBN[] = fs
    .readFileSync(
      `${process.cwd()}/packages/cover-web-app/public/images/isbn/_suffixes.txt`,
    )
    .toString()
    .split('\n')
    .map(suffix => `978-1-64476-${suffix}`);

  for (let isbn of all) {
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
