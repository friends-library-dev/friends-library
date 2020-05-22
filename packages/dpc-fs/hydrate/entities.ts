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

  const edition = editions.get(dpc.path);
  if (!edition) {
    throw new Error(`No entities found for path: ${dpc.path}`);
  }

  dpc.friend = edition.document.friend;
  dpc.document = edition.document;
  dpc.printSize = edition.document.printSize;
  dpc.documentId = edition.document.id;
  dpc.edition = edition;
  dpc.paperbackSplits = edition.splits || [];
  dpc.blurb = edition.document.description || dpc.friend.description;
  dpc.isCompilation = dpc.document.isCompilation;
}

function getEditions(): Map<string, Edition> {
  const editions = new Map<string, Edition>();
  [...getAllFriends('en', true), ...getAllFriends('es', true)].forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        editions.set(edition.path, edition);
      });
    });
  });
  return editions;
}
