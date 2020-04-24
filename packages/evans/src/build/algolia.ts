import fs from 'fs';
import { sync as glob } from 'glob';
import { safeLoad as ymlToJs } from 'js-yaml';
import algoliasearch from 'algoliasearch';
import { t, translate } from '@friends-library/locale';
import {
  Friend,
  Document,
  numPublishedBooks,
  allPublishedFriends,
  allPublishedAudiobooks,
  allPublishedUpdatedEditions,
} from '@friends-library/friends';
import env from '@friends-library/env';
import { allFriends, htmlShortTitle } from './helpers';
import { friendUrl, documentUrl } from '../lib/url';
import { LANG } from '../env';
import { PAGE_META_DESCS } from '../lib/seo';

if (process.env.FORCE_ALGOLIA_SEND) {
  require('@friends-library/env/load');
  sendSearchDataToAlgolia();
}

export async function sendSearchDataToAlgolia(): Promise<void> {
  const { GATSBY_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY } = env.require(
    'GATSBY_ALGOLIA_APP_ID',
    'ALGOLIA_ADMIN_KEY',
  );

  const client = algoliasearch(GATSBY_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  const friends = allFriends().filter(f => f.lang === LANG);

  const friendsIndex = client.initIndex(`${LANG}_friends`);
  await friendsIndex.replaceAllObjects(friends.map(friendRecord));
  await friendsIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: '[...]',
    attributesToSnippet: ['description:30'],
    searchableAttributes: ['name', 'bookTitles', 'description', 'residences'],
  });

  const docsIndex = client.initIndex(`${LANG}_docs`);
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

  const pagesIndex = client.initIndex(`${LANG}_pages`);
  await pagesIndex.replaceAllObjects([...mdxRecords(), ...customPageRecords()], {
    autoGenerateObjectIDIfNotExist: true,
  });
  await pagesIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: '[...]',
    attributesToSnippet: ['text:30'],
    searchableAttributes: ['title', 'subtitle', 'text'],
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
    residences: friend.residences
      .map(r => `${translate(r.city)}, ${translate(r.region)}`)
      .join(' — '),
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

function mdxRecords(): Record<string, string | null>[] {
  const paths = glob(`${__dirname}/../mdx/*.${LANG}.mdx`);
  return paths.flatMap(filePath => {
    const content = fs.readFileSync(filePath).toString();
    const [, yaml, text] = content.split(/---\n/m);
    const frontmatter = ymlToJs(yaml);
    const records: Record<string, string | null>[] = [
      {
        title: frontmatter.title,
        url: frontmatter.path,
        text: convertEntities(replaceCounts(frontmatter.description)),
      },
    ];
    const paras = removeMarkdownFormatting(convertEntities(replaceCounts(text.trim())))
      .split('\n\n')
      .map(sanitizeMdParagraph)
      .filter(Boolean);

    let currentSubtitle: null | string = null;
    for (const para of paras) {
      if (para.startsWith('#')) {
        currentSubtitle = para.replace(/^#+ /, '');
        continue;
      }
      records.push({
        url: frontmatter.path,
        title: frontmatter.title,
        subtitle: currentSubtitle,
        text: para,
      });
    }
    return records;
  });
}

function customPageRecords(): Record<string, string | null>[] {
  return [
    {
      title: t`Audio Books`,
      url: t`/audiobooks`,
      text: replaceCounts(PAGE_META_DESCS.audiobooks[LANG]),
    },
    {
      title: t`Contact Us`,
      url: t`/contact`,
      text: replaceCounts(PAGE_META_DESCS.contact[LANG]),
    },
    {
      title: t`Explore Books`,
      url: t`/explore`,
      text: replaceCounts(PAGE_META_DESCS.explore[LANG]),
    },
    {
      title: t`All Friends`,
      url: t`/friends`,
      text: replaceCounts(PAGE_META_DESCS.friends[LANG]),
    },
    {
      title: t`Getting Started`,
      url: t`/getting-started`,
      text: replaceCounts(PAGE_META_DESCS['getting-started'][LANG]),
    },
  ];
}

function shortTitle(title: string): string {
  return convertEntities(htmlShortTitle(title));
}

function convertEntities(input: string): string {
  return input
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“');
}

function removeMarkdownFormatting(md: string): string {
  return md
    .replace(/(\*\*|_)/g, '')
    .replace(/^> /gm, '')
    .replace(/{' '}/g, '')
    .replace(/<.+?>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function replaceCounts(str: string): string {
  return str
    .replace(/%NUM_ENGLISH_BOOKS%/g, String(numPublishedBooks('en')))
    .replace(/%NUM_SPANISH_BOOKS%/g, String(numPublishedBooks('es')))
    .replace(/%NUM_FRIENDS%/g, String(allPublishedFriends(LANG).length))
    .replace(/%NUM_UPDATED_EDITIONS%/g, String(allPublishedUpdatedEditions(LANG).length))
    .replace(/%NUM_AUDIOBOOKS%/g, String(allPublishedAudiobooks(LANG).length));
}

function sanitizeMdParagraph(paragraph: string): string {
  return paragraph
    .split('\n')
    .filter(l => !l.match(/^<\/?Lead>/))
    .join(' ')
    .replace(/<\/?iframe(.*?)>/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/^- /, '')
    .trim();
}
