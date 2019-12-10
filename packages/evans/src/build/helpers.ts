import { getAllFriends, Friend, Document, Edition } from '@friends-library/friends';
import { Slug, ISBN } from '@friends-library/types';

let friends: Friend[] = [];

export function allFriends(): Friend[] {
  if (!friends.length) {
    friends = getAllFriends('en')
      .concat(getAllFriends('es'))
      .filter(f => !['Jane Doe', 'John Doe'].includes(f.name));
  }
  return friends;
}

let friendsMap: Map<Slug, Friend> = new Map();

export function allFriendsMap(): Map<Slug, Friend> {
  if (friendsMap.size === 0) {
    for (let friend of allFriends()) {
      friendsMap.set(friend.path, friend);
    }
  }
  return friendsMap;
}

let docsMap: Map<Slug | ISBN, Document> = new Map();

export function allDocsMap(): Map<Slug | ISBN, Document> {
  if (docsMap.size === 0) {
    for (let friend of allFriends()) {
      for (let document of friend.documents) {
        docsMap.set(document.slug, document);
        docsMap.set(document.id, document);
      }
    }
  }
  return docsMap;
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
