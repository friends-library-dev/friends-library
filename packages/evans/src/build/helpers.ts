import { allFriends, Friend, Document } from '@friends-library/friends';
import { Slug, ISBN, Asciidoc } from '@friends-library/types';

export function justHeadings(adoc: Asciidoc): Asciidoc {
  return adoc.split(`\n\n`).slice(0, 1).join(``);
}

const friendsMap: Map<Slug, Friend> = new Map();

export function allFriendsMap(): Map<Slug, Friend> {
  if (friendsMap.size === 0) {
    for (const friend of allFriends()) {
      friendsMap.set(friend.path, friend);
    }
  }
  return friendsMap;
}

const docsMap: Map<Slug | ISBN, Document> = new Map();

export function allDocsMap(): Map<Slug | ISBN, Document> {
  if (docsMap.size === 0) {
    for (const friend of allFriends()) {
      for (const document of friend.documents) {
        docsMap.set(document.slug, document);
        docsMap.set(document.id, document);
      }
    }
  }
  return docsMap;
}
