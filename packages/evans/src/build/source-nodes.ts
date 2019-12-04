import chalk from 'chalk';
import { Friend, Document } from '@friends-library/friends';
import { ARTIFACT_TYPES } from '@friends-library/types';
import { getPartials } from '../../src/lib/partials';
import {
  logDownloadUrl,
  audioUrl,
  podcastUrl,
  friendUrl,
  documentUrl,
} from '../../src/lib/url';
import { allFriends, eachEdition } from './helpers';

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
    const color = friend.isMale ? 'cyan' : 'magenta';
    const msg = chalk[color].dim(`Create friend node: ${friend.path}`);
    console.log(`${friend.isMale ? '👴' : '👵'}  ${msg}`);
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

  eachEdition(({ document, edition, friend }) => {
    if (edition.audio) {
      const props = {
        id: `audio:${audioUrl(edition.audio)}`,
        url: audioUrl(edition.audio),
        podcastUrl: podcastUrl(edition.audio),
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
    url: friendUrl(friend),
    documents: friend.documents.map(documentNodeProps),
  };
}

function documentNodeProps(doc: Document): Record<string, any> {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    filename: doc.filenameBase,
    hasAudio: doc.hasAudio,
    isCompilation: doc.isCompilation,
    hasUpdatedEdition: doc.hasUpdatedEdition,
    tags: doc.tags,
    url: documentUrl(doc),
    editions: doc.editions.map(edition => ({
      type: edition.type,
      description: edition.description || '',
      formats: ARTIFACT_TYPES.filter(t => t !== 'paperback-cover').map(type => ({
        type,
        url: logDownloadUrl(edition, type),
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
