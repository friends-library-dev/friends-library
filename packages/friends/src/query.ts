import { Slug, Lang } from '@friends-library/types';
import { basename, resolve } from 'path';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import Friend from './Friend';
import friendFromJS from './map';

export function getFriend(slug: Slug, lang: Lang = 'en'): Friend {
  const path = resolve(__dirname, `../yml/${lang}/${slug}.yml`);
  const file = readFileSync(path);
  const data = safeLoad(file.toString());
  return friendFromJS({ lang, ...data });
}

export function getAllFriends(
  lang: Lang = 'en',
  withCompilations: boolean = false,
): Friend[] {
  const pattern = resolve(__dirname, `../yml/${lang}/*.yml`);
  const friends = glob(pattern).map(path => getFriend(basename(path, '.yml'), lang));
  if (withCompilations) {
    return friends;
  }
  return friends.filter(friend => friend.slug !== 'compilations');
}
