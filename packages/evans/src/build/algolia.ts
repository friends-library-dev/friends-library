import { Friend, Document } from '@friends-library/friends';
import env from '@friends-library/env';
import { allFriends, htmlShortTitle } from './helpers';
import { friendUrl, documentUrl } from '../lib/url';
import algoliasearch from 'algoliasearch';

export async function sendSearchDataToAlgolia(): Promise<void> {
  const { GATSBY_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, GATSBY_LANG } = env.require(
    'GATSBY_ALGOLIA_APP_ID',
    'ALGOLIA_ADMIN_KEY',
    'GATSBY_LANG',
  );

  const friends = allFriends().filter(f => f.lang === GATSBY_LANG);
  const client = algoliasearch(GATSBY_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  const friendsIndex = client.initIndex(`${GATSBY_LANG}_friends`);
  await friendsIndex.replaceAllObjects(friends.map(friendRecord));
  await friendsIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: '[...]',
    attributesToSnippet: ['description:30'],
    searchableAttributes: ['name', 'bookTitles', 'description', 'residences'],
  });

  const docsIndex = client.initIndex(`${GATSBY_LANG}_docs`);
  await docsIndex.replaceAllObjects(
    friends
      .flatMap(f => f.documents)
      .filter(d => d.hasNonDraftEdition)
      .map(documentRecord),
  );
  await docsIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: '[...]',
    attributesToSnippet: [
      'description:30',
      'partialDescription:30',
      'featuredDescription:30',
    ],
    searchableAttributes: [
      'title',
      'originalTitle',
      'description',
      'partialDescription',
      'featuredDescription',
      'authorName',
      'tags',
    ],
  });
}

function friendRecord(friend: Friend): Record<string, string> {
  return {
    objectID: friend.id,
    name: friend.name,
    url: friendUrl(friend),
    bookTitles:
      '“' +
      friend.documents
        .filter(d => d.hasNonDraftEdition)
        .map(d => shortTitle(d.title))
        .join('”, “') +
      '”',
    residences: friend.residences.map(r => `${r.city}, ${r.region}`).join(' — '),
    description: friend.description,
  };
}

function documentRecord(doc: Document): Record<string, string | undefined> {
  return {
    objectID: doc.id,
    title: shortTitle(doc.title),
    authorName: doc.friend.name,
    url: documentUrl(doc),
    originalTitle: doc.originalTitle,
    description: doc.description,
    partialDescription: doc.partialDescription,
    featuredDescription: doc.featuredDescription,
    tags: doc.tags.join(', '),
  };
}

function shortTitle(title: string): string {
  return htmlShortTitle(title)
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ');
}
