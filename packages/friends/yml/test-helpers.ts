import glob from 'glob';
import { basename } from 'path';

interface File {
  path: string;
  name: string;
  short: string;
}

export function yamlGlob(pattern: string): File[] {
  return glob.sync(pattern).map(path => ({
    path,
    name: basename(path),
    short: path.replace(/.+?\/yml\//, ``),
  }));
}

export function tags(friend: any): string[] {
  return friend.documents.reduce(
    (accum: string[], doc: any) => accum.concat(doc.tags || []),
    [] as string[],
  );
}

export function editions(friend: any): any[] {
  return friend.documents.reduce(
    (accum: any, doc: any) => accum.concat(doc.editions || []),
    [] as any[],
  );
}

export function formats(friend: any): any[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.formats || []),
    [] as any[],
  );
}

export function chapters(friend: any): any[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.chapters || []),
    [] as any[],
  );
}

export function audioParts(friend: any): any[] {
  return editions(friend).reduce(
    (accum, ed) => accum.concat(ed.audio ? ed.audio.parts : []),
    [] as any[],
  );
}

export function hasProp(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isSlug(slug: any): boolean {
  if (typeof slug !== `string`) {
    return false;
  }

  return slug.match(/[^a-z0-9-]/) === null;
}
