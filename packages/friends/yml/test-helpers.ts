import glob from 'glob';
import { basename } from 'path';
import { Friend, Edition, Format, AudioPart, Chapter } from '../src';

interface File {
  path: string;
  name: string;
  short: string;
}

export function yamlGlob(pattern: string): File[] {
  return glob.sync(pattern).map(path => ({
    path,
    name: basename(path),
    short: path.replace(/^src\//, ''),
  }));
}

export function tags(friend: Friend): string[] {
  return friend.documents.reduce(
    (accum, doc) => accum.concat(doc.tags || []),
    [] as string[],
  );
}

export function editions(friend: Friend): Edition[] {
  return friend.documents.reduce(
    (accum, doc) => accum.concat(doc.editions || []),
    [] as Edition[],
  );
}

export function formats(friend: Friend): Format[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.formats || []),
    [] as Format[],
  );
}

export function chapters(friend: Friend): Chapter[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.chapters || []),
    [] as Chapter[],
  );
}

export function audioParts(friend: Friend): AudioPart[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.audio ? ed.audio.parts : []),
    [] as AudioPart[],
  );
}

export function hasProp(obj: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isSlug(slug: any): boolean {
  if (typeof slug !== 'string') {
    return false;
  }

  return slug.match(/[^a-z0-9-]/) === null;
}
