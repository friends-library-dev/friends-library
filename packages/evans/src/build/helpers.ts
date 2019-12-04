import { getAllFriends, Friend, Document, Edition } from '@friends-library/friends';
import { LANG } from '../../src/env';
import { Slug } from '@friends-library/types';

export const allFriends = getAllFriends(LANG);

export const allFriendsMap: Map<Slug, Friend> = new Map();
for (let friend of allFriends) {
  allFriendsMap.set(friend.slug, friend);
}

interface EditionCallback {
  (obj: { friend: Friend; document: Document; edition: Edition }): void;
}

export function eachEdition(cb: EditionCallback): void {
  allFriends.forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        cb({ friend, document, edition });
      });
    });
  });
}
