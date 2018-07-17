// @flow
import glob from 'glob';
import { basename } from 'path';

type File = {|
  path: string,
  name: string,
  short: string,
|};

export function yamlGlob(pattern: string): Array<File> {
  return glob.sync(pattern).map(path => ({
    path,
    name: basename(path),
    short: path.replace(/^src\//, ''),
  }));
}

export function tags(friend: Object): Array<Object> {
  return friend.documents.reduce((accum, doc) => accum.concat(doc.tags || []), []);
}

export function editions(friend: Object): Array<Object> {
  return friend.documents.reduce((accum, doc) => accum.concat(doc.editions || []), []);
}

export function formats(friend: Object): Array<Object> {
  return editions(friend).reduce((accum, ed) => accum.concat(ed.formats || []), []);
}

export function chapters(friend: Object): Array<Object> {
  return editions(friend).reduce((accum, ed) => accum.concat(ed.chapters || []), []);
}

export function audioParts(friend: Object): Array<Object> {
  return editions(friend).reduce((accum, ed) => accum.concat(ed.audio ? ed.audio.parts : []), []);
}

export function hasProp(obj: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isSlug(slug: mixed): boolean {
  if (typeof slug !== 'string') {
    return false;
  }

  return slug.match(/[^a-z0-9-]/) === null;
}
