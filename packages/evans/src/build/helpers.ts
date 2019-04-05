import {
  getAllFriends,
  Friend,
  Document,
  Edition,
  Format,
} from '@friends-library/friends';
import { LANG } from '../../src/env';

export const allFriends = getAllFriends(LANG);

interface FormatCallback {
  (obj: { friend: Friend; document: Document; edition: Edition; format: Format }): void;
}

export function eachFormat(cb: FormatCallback): void {
  allFriends.forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        edition.formats.forEach(format => {
          cb({ friend, document, edition, format });
        });
      });
    });
  });
}
