import { sync as glob } from 'glob';
import { Edition, Friend, Document, getAllFriends } from '@friends-library/friends';
import { needingUpdate } from './filters';
import { requireEnv } from '@friends-library/types';

export interface SourceDocument {
  fullPath: string;
  friend: Friend;
  document: Document;
  edition: Edition;
}

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');

export function getSourceDocs(pattern?: string): SourceDocument[] {
  const editions = getEditions();
  return glob(`${ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.includes(pattern))
    .map(path => path.replace(/\/$/, ''))
    .map(path => sourceDocFromPath(path, editions))
    .filter(needingUpdate);
}

function sourceDocFromPath(path: string, editions: Map<string, Edition>): SourceDocument {
  const relPath = path.replace(new RegExp(`^${ROOT}`), '');
  const edition = editions.get(relPath);
  if (!edition) throw new Error(`Unable to find entities from path: ${path}`);
  const document = edition.document;
  const friend = document.friend;
  return {
    fullPath: path,
    friend,
    document,
    edition,
  };
}

function getEditions(): Map<string, Edition> {
  const editions = new Map<string, Edition>();
  [...getAllFriends('en'), ...getAllFriends('es')].forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        editions.set(edition.id(), edition);
      });
    });
  });
  return editions;
}
