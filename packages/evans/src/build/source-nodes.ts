import chalk from 'chalk';
import { Friend, Document } from '@friends-library/friends';
import { getPartials } from '../../src/lib/partials';
import { formatUrl } from '../../src/lib/url';
import { allFriends, eachFormat } from './helpers';

export default function sourceNodes(
  { actions, createContentDigest }: any,
  configOptions: any,
): void {
  const { createNode } = actions;
  delete configOptions.plugins;

  Object.entries(getPartials()).forEach(([slug, html]) => {
    createNode({
      id: `partial:${slug}`,
      html,
      internal: {
        type: 'Partial',
        content: html,
        contentDigest: createContentDigest(html),
      },
    });
  });

  console.log('\n🚀  Creating nodes from Friends .yml files');
  console.log('-----------------------------------------');

  allFriends.forEach(friend => {
    const color = friend.isMale() ? 'cyan' : 'magenta';
    const msg = chalk[color].dim(`Create friend node: ${friend.path}`);
    console.log(`${friend.isMale() ? '👴' : '👵'}  ${msg}`);
    const friendProps = friendNodeProps(friend);
    createNode({
      id: friend.id,
      internal: {
        type: 'Friend',
        content: JSON.stringify(friendProps),
        contentDigest: createContentDigest(friendProps),
      },
      ...friendProps,
    });

    friend.documents.forEach(document => {
      console.log(chalk.gray(`  ↳ 📙  Create document node: ${document.path}`));
      const docProps = documentNodeProps(document);
      createNode({
        id: document.id,
        internal: {
          type: 'Document',
          content: JSON.stringify(docProps),
          contentDigest: createContentDigest(docProps),
        },
        friendSlug: friend.slug,
        ...docProps,
      });
    });
  });

  eachFormat(({ format, document, edition, friend }) => {
    if (format.type === 'audio' && edition.audio) {
      const props = {
        id: `audio:${edition.audio.url()}`,
        url: format.url(),
        podcastUrl: edition.audio.url(),
        friendName: friend.name,
        documentTitle: document.title,
      };
      createNode({
        ...props,
        internal: {
          type: 'Audio',
          content: JSON.stringify(props),
          contentDigest: createContentDigest(props),
        },
      });
    }
  });

  console.log('\n');
}

function friendNodeProps(friend: Friend): Record<string, any> {
  return {
    id: friend.id,
    name: friend.name,
    slug: friend.slug,
    gender: friend.gender,
    description: friend.description,
    url: friend.url(),
    documents: friend.documents.map(documentNodeProps),
  };
}

function documentNodeProps(doc: Document): Record<string, any> {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    filename: doc.filename,
    hasAudio: doc.hasAudio(),
    isCompilation: doc.isCompilation(),
    hasUpdatedEdition: doc.hasUpdatedEdition(),
    shortestEdition: (({ pages }) => ({ pages }))(doc.shortestEdition()),
    tags: doc.tags,
    url: doc.url(),
    editions: doc.editions.map(edition => ({
      type: edition.type,
      description: edition.description || '',
      formats: edition.formats.map(format => ({
        type: format.type,
        url: formatUrl(format),
      })),
      ...(edition.audio
        ? {
            audio: {
              reader: edition.audio.reader,
              parts: edition.audio.parts.map(part => ({
                title: part.title,
                externalIdHq: part.externalIdHq,
              })),
            },
          }
        : {}),
    })),
  };
}
