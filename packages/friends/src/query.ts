import { Slug, Lang } from '@friends-library/types';
import { basename, resolve } from 'path';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import Friend from './Friend';
import Edition from './Edition';
import Document from './Document';
import friendFromJS from './map';
import { FriendData } from './types';

export function getFriend(slug: Slug, lang: Lang = `en`): Friend {
  const path = ymlPath(`${lang}/${slug}.yml`);
  const file = readFileSync(path);
  const data = safeLoad(file.toString()) as FriendData;
  return friendFromJS({ ...data, lang });
}

export function getAllFriends(lang: Lang = `en`, withCompilations = false): Friend[] {
  const pattern = ymlPath(`${lang}/*.yml`);
  const friends = glob(pattern).map((path) => getFriend(basename(path, `.yml`), lang));
  if (withCompilations) {
    return friends;
  }
  const compilations = lang === `en` ? `compilations` : `compilaciones`;
  return friends.filter((friend) => friend.slug !== compilations);
}

export function allPublishedBooks(lang: Lang): Document[] {
  return getAllFriends(lang, true)
    .flatMap((friend) => friend.documents)
    .filter((document) => document.hasNonDraftEdition);
}

export function allPublishedUpdatedEditions(lang: Lang): Edition[] {
  return allPublishedBooks(lang)
    .flatMap((doc) => doc.editions)
    .filter((edition) => edition.type === `updated`);
}

export function allPublishedFriends(lang: Lang): Friend[] {
  return getAllFriends(lang, true).filter((friend) => friend.hasNonDraftDocument);
}

export function allPublishedAudiobooks(lang: Lang): Edition[] {
  return allPublishedBooks(lang)
    .flatMap((doc) => doc.editions)
    .filter((edition) => !!edition.audio);
}

export function numPublishedBooks(lang: Lang): number {
  return allPublishedBooks(lang).length;
}

let friends: Friend[] = [];

export function allFriends(): Friend[] {
  if (!friends.length) {
    friends = getAllFriends(`en`, true)
      .concat(getAllFriends(`es`, true))
      .filter((f) => ![`Jane Doe`, `John Doe`].includes(f.name));
  }
  return friends;
}

export interface EditionCallback {
  (obj: { friend: Friend; document: Document; edition: Edition }): void;
}

export function eachEdition(cb: EditionCallback): void {
  allFriends().forEach((friend) => {
    friend.documents.forEach((document) => {
      document.editions.forEach((edition) => {
        cb({ friend, document, edition });
      });
    });
  });
}

function ymlPath(end: string): string {
  return resolve(process.env.FRIENDS_YML_PATH || `${__dirname}/../yml`, end);
}
