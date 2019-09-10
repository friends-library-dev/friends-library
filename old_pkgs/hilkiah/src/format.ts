import data from './books.json';
import { Ref } from './find';

const books = data as {
  name: string;
  short: string;
}[];

export function format({ book, verses, contiguous, match }: Ref, opts = {}): string {
  const options = {
    shortBookNames: true,
    preserveFull: true,
    ...opts,
  };

  let str = book;
  const found = books.find(b => b.name === book);
  if (!found) throw new Error(`Invalid book name ${book}`);
  const { short } = found;

  if (options.shortBookNames && short !== book) {
    str = `${short}.`;
  }

  if (options.preserveFull && match.indexOf(book) === 0) {
    str = book;
  }

  str += ` ${verses[0].chapter}:${verses[0].verse}`;
  if (verses.length === 1) {
    return str;
  }

  if (contiguous) {
    return `${str}-${(verses.pop() || { verse: '' }).verse}`;
  }

  return `${str},${verses
    .slice(1)
    .map(v => v.verse)
    .join(',')}`;
}
