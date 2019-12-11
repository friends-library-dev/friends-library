import omit from 'lodash/omit';
import Friend from './Friend';
import Document from './Document';
import Edition from './Edition';
import Audio from './Audio';
import AudioPart from './AudioPart';
import { FriendData, EditionData } from './types';

export default function friendFromJS(json: FriendData): Friend {
  const friend = new Friend(omit(json, 'documents'));

  friend.documents = json.documents.map(docData => {
    const document = new Document(omit(docData, 'editions'));
    document.friend = friend;
    docData.editions.sort(sortEditions);

    document.editions = docData.editions.map(edData => {
      const edition = new Edition(omit(edData, 'audio'));
      edition.document = document;

      if (edData.audio) {
        edition.audio = new Audio(omit(edData.audio, 'parts'));
        edition.audio.parts = edData.audio.parts.map(
          audioPartData => new AudioPart(audioPartData),
        );
        edition.audio.edition = edition;
      }

      return edition;
    });

    return document;
  });

  return friend;
}

function sortEditions(ed1: EditionData, ed2: EditionData): number {
  if (ed1.type === 'updated') {
    return -1;
  }
  if (ed1.type === 'modernized') {
    return ed2.type === 'updated' ? 1 : -1;
  }
  return 1;
}
