import path from 'path';
import { Document, Edition, Format } from '@friends-library/friends';

const FriendPage = path.resolve('src/templates/FriendPage.tsx');
const DocumentPage = path.resolve('src/templates/DocumentPage.tsx');
const AudioPage = path.resolve('src/templates/AudioPage.tsx');

export default function onCreateNode({ node, actions: { createPage } }: any) {
  if (node.internal.type !== 'Friend') {
    return;
  }

  createPage({
    path: node.url,
    component: FriendPage,
    context: {
      slug: node.slug,
    },
  });

  node.documents.forEach((document: Document) => {
    createPage({
      path: document.url,
      component: DocumentPage,
      context: {
        friendSlug: node.slug,
        documentSlug: document.slug,
      },
    });

    document.editions.forEach((edition: Edition) => {
      edition.formats.forEach((format: Format) => {
        if (format.type === 'audio') {
          createPage({
            path: format.url,
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
  });
}
