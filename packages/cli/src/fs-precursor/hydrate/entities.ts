import { Edition, getAllFriends } from '@friends-library/friends';
import FsDocPrecursor from '../FsDocPrecursor';

let editions: undefined | Map<string, Edition>;

export default function entities(dpc: FsDocPrecursor): void {
  if (dpc.friend && dpc.document && dpc.edition) {
    return;
  }

  if (!editions) {
    editions = getEditions();
  }

  const edition = editions.get(dpc.relPath);
  if (!edition) {
    throw new Error(`No entities found for path: ${dpc.relPath}`);
  }

  dpc.friend = edition.document.friend;
  dpc.document = edition.document;
  dpc.edition = edition;
}

function getEditions(): Map<string, Edition> {
  const editions = new Map<string, Edition>();
  [...getAllFriends('en'), ...getAllFriends('es')].forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        editions.set(edition.path, edition);
      });
    });
  });
  return editions;
}
