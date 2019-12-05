import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import { allFriends } from './helpers';
import * as url from '../lib/url';
import { getPartials } from '../lib/partials';

const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  Object.entries(getPartials()).forEach(([slug, html]) => {
    createNode({
      id: `partial:${slug}`,
      html,
      internal: {
        type: 'Partial',
        contentDigest: createContentDigest(html),
      },
    });
  });

  allFriends().forEach(friend => {
    const friendProps = {
      ...friend.toJSON(),
      friendId: friend.id,
      url: url.friendUrl(friend),
    };

    createNode({
      ...friendProps,
      id: createNodeId(`friend-${friend.id}`),
      children: friend.documents.map(d => createNodeId(`document-${d.id}`)),
      internal: {
        type: 'Friend',
        contentDigest: createContentDigest(friendProps),
      },
    });

    friend.documents.forEach(document => {
      const documentProps = {
        ...document.toJSON(),
        url: url.documentUrl(document),
        documentId: document.id,
        friendSlug: friend.slug,
      };

      createNode({
        ...documentProps,
        id: createNodeId(`document-${document.id}`),
        parent: createNodeId(`friend-${friend.id}`),
        children: document.editions.map(e => createNodeId(`edition-${e.path}`)),
        internal: {
          type: 'Document',
          contentDigest: createContentDigest(documentProps),
        },
      });

      document.editions.forEach(edition => {
        const editionProps = {
          ...edition.toJSON(),
          url: url.editionUrl(edition),
          friendSlug: friend.slug,
          documentSlug: document.slug,
          audio: edition.audio
            ? {
                reader: edition.audio.reader,
                url: url.audioUrl(edition.audio),
                podcastUrl: url.podcastUrl(edition.audio),
                parts: edition.audio.parts.map(part => part.toJSON()),
              }
            : undefined,
        };
        createNode({
          ...editionProps,
          id: createNodeId(`edition-${edition.path}`),
          parent: createNodeId(`document-${document.id}`),
          internal: {
            type: 'Edition',
            contentDigest: createContentDigest(editionProps),
          },
        });
      });
    });
  });
};

export default sourceNodes;
