import { sync as glob } from 'glob';
import { Edition, getAllFriends } from '@friends-library/friends';
import { SourceDocument } from './handler';
import { requireEnv } from '@friends-library/types';

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');

export function getAllSourceDocs(pattern?: string): SourceDocument[] {
  const paths = glob(`${ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.indexOf(pattern) !== -1)
    .map(path => path.replace(/\/$/, ''));
  const editions = getEditions();
  return paths.map(path => sourceDocFromPath(path, editions));
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
        const path = `${friend.lang}/${friend.slug}/${document.slug}/${edition.type}`;
        editions.set(path, edition);
      });
    });
  });
  return editions;
}
