import fs from 'fs';
import { safeLoad } from 'js-yaml';
import { FriendData } from '../types';
import Friend from '../Friend';
import Document from '../Document';
import friendFromJS from '../map';
import Edition from '../Edition';

let origFriendData: FriendData | undefined;

export interface Spec {
  (fd: FriendData): void;
}

export function testFriend(spec?: Spec): Friend {
  if (!origFriendData) {
    origFriendData = safeLoad(
      fs.readFileSync(`${__dirname}/fixture.yml`).toString(),
    ) as FriendData;
    origFriendData.lang = `en`;
  }
  const data = JSON.parse(JSON.stringify(origFriendData));
  if (spec) {
    spec(data);
  }
  return friendFromJS(data);
}

export function firstDoc(spec?: Spec): Document {
  const friend = testFriend(spec);
  return friend.documents[0];
}

export function firstEdition(spec?: Spec): Edition {
  const doc = firstDoc(spec);
  return doc.editions[0];
}
