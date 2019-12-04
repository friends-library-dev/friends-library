import path from 'path';
import { Document, Edition } from '@friends-library/friends';
import { audioUrl, documentUrl } from '../lib/url';
import { allFriendsMap } from './helpers';

const FriendPage = path.resolve('./src/templates/FriendPage.tsx');
const DocumentPage = path.resolve('./src/templates/DocumentPage.tsx');
const AudioPage = path.resolve('./src/templates/AudioPage.tsx');

export default function onCreateNode({ node, actions: { createPage } }: any): void {
  if (node.internal.type !== 'Friend') {
    return;
  }

  const friend = allFriendsMap.get(node.slug);
  if (!friend) {
    throw new Error(`Error finding friend for slug: ${node.slug}`);
  }

  createPage({
    path: node.url,
    component: FriendPage,
    context: {
      slug: node.slug,
    },
  });

  friend.documents.forEach((document: Document) => {
    createPage({
      path: documentUrl(document),
      component: DocumentPage,
      context: {
        friendSlug: node.slug,
        documentSlug: document.slug,
      },
    });

    document.editions.forEach((edition: Edition) => {
      if (edition.audio) {
        createPage({
          path: audioUrl(edition.audio),
          component: AudioPage,
          context: {
            friendSlug: node.slug,
            documentSlug: document.slug,
            editionType: edition.type,
          },
        });
      }
    });
  });
}
