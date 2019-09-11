import FsDocPrecursor from '../FsDocPrecursor';
import hydrateEntities from './entities';

export default function meta(dpc: FsDocPrecursor): void {
  hydrateEntities(dpc);
  const { friend, document, edition } = dpc;
  if (!friend || !document || !edition) {
    throw new Error('Unexpected lack of entities');
  }

  dpc.meta = {
    title: document.title,
    author: {
      name: friend.name,
      nameSort: friend.alphabeticalName(),
    },
  };

  if (document.originalTitle) {
    dpc.meta.originalTitle = document.originalTitle;
  }

  if (document.published) {
    dpc.meta.published = document.published;
  }

  if (edition.isbn) {
    dpc.meta.isbn = edition.isbn;
  }

  if (edition.editor) {
    dpc.meta.editor = edition.editor;
  }
}
