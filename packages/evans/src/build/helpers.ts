import { getAllFriends, Friend, Document, Edition } from '@friends-library/friends';
import { LANG } from '../../src/env';
import { Slug } from '@friends-library/types';

let friends: Friend[] = [];

export function allFriends(): Friend[] {
  if (!friends.length) {
    friends = getAllFriends(LANG);
  }
  return friends;
}

let friendsMap: Map<Slug, Friend> = new Map();

export function allFriendsMap(): Map<Slug, Friend> {
  if (friendsMap.size === 0) {
    for (let friend of allFriends()) {
      friendsMap.set(friend.slug, friend);
    }
  }
  return friendsMap;
}

interface EditionCallback {
  (obj: { friend: Friend; document: Document; edition: Edition }): void;
}

export function eachEdition(cb: EditionCallback): void {
  allFriends().forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        cb({ friend, document, edition });
      });
    });
  });
}
