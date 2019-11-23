import { Slug, Lang } from '@friends-library/types';
import { basename, resolve } from 'path';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import Friend from './Friend';
import Document from './Document';
import Edition from './Edition';
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

export function query(
  lang: Lang,
  friendSlug: Slug,
  docSlug?: Slug,
  editionType?: Slug,
): {
  friend: Friend;
  document: Document;
  edition: Edition;
} {
  const friend = getFriend(friendSlug, lang);
  const result = {
    friend,
    document: new Document(),
    edition: new Edition(),
  };

  if (docSlug) {
    const { documents } = friend;
    const document: Document = documents.find(d => d.slug === docSlug) || new Document();
    result.document = document;
  }

  if (editionType && result.document) {
    const {
      document: { editions },
    } = result;
    const edition: Edition = editions.find(e => e.type === editionType) || new Edition();
    result.edition = edition;
  }

  return result;
}
