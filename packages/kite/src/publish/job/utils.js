// @flow
import { Edition } from '@friends-library/friends';
import type { DocumentMeta } from '../../type';

export function getDocumentMeta(edition: Edition): DocumentMeta {
  const { document } = edition;
  const { friend } = document;
  return {
    title: document.title,
    author: {
      name: friend.name,
      nameSort: friend.alphabeticalName(),
    },
    ...document.originalTitle ? { originalTitle: document.originalTitle } : {},
    ...document.published ? { published: document.published } : {},
    ...edition.isbn ? { isbn: edition.isbn } : {},
    ...edition.editor ? { editor: edition.editor } : {},
  };
}
