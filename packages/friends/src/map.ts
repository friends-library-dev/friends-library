import omit from 'lodash/omit';
import Friend from './Friend';
import Document from './Document';
import Edition from './Edition';
import Chapter from './Chapter';
import Audio from './Audio';
import AudioPart from './AudioPart';
import { FriendData } from './types';

export default function friendFromJS(json: FriendData): Friend {
  const friend = new Friend(omit(json, 'documents'));

  friend.documents = json.documents.map(docData => {
    const document = new Document(omit(docData, 'editions'));
    document.friend = friend;

    document.editions = docData.editions.map(edData => {
      const edition = new Edition(omit(edData, ['chapters', 'audio']));
      edition.document = document;

      edition.chapters = edData.chapters.map(chapData => {
        return new Chapter(chapData);
      });

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
