import fs from 'fs';
import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import { price } from '@friends-library/lulu';
import { fetch } from '@friends-library/document-meta';
import { query, hydrate } from '@friends-library/dpc-fs';
import { red } from '@friends-library/cli-utils/color';
import { allFriends, allDocsMap } from './helpers';
import * as url from '../lib/url';
import { getPartials } from '../lib/partials';
import { PrintSize, Heading } from '@friends-library/types';
import { NODE_ENV, APP_ALT_URL, LANG } from '../env';

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

  const meta = await fetch();
  const friends = allFriends();
  const docs = allDocsMap();
  const dpcCache = getDpcCache();

  friends.forEach(friend => {
    if (friend.lang !== LANG) {
      return;
    }

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
      const documentProps: Record<string, any> = {
        ...document.toJSON(),
        url: url.documentUrl(document),
        documentId: document.id,
        friendSlug: friend.slug,
      };

      if (document.altLanguageId) {
        const altDoc = docs.get(document.altLanguageId);
        if (!altDoc) throw new Error(`Missing alt language doc from ${document.path}`);
        documentProps.altLanguageUrl = `${APP_ALT_URL}${url.documentUrl(altDoc)}`;
      }

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
        const editionMeta = meta.get(edition.path);
        let printSize: PrintSize = 'm';
        let pages = [175];
        if (editionMeta) {
          printSize = editionMeta.paperback.size;
          pages = editionMeta.paperback.volumes;
        } else {
          red(`Edition meta not found for ${edition.path}`);
        }

        let headings: Heading[] = dpcCache.get(edition.path) || [];
        if (headings.length === 0) {
          const [dpc] = query.getByPattern(edition.path);
          if (dpc) {
            hydrate.asciidoc(dpc);
            hydrate.process(dpc);
            headings = dpc.sections.map(sect => sect.heading);
            dpcCache.set(edition.path, headings);
            persistDpcCache(dpcCache);
          }
        }

        const editionProps = {
          ...edition.toJSON(),
          url: url.editionUrl(edition),
          friendSlug: friend.slug,
          documentSlug: document.slug,
          printSize,
          pages,
          chapterHeadings: headings,
          price: price(printSize, pages),
          numChapters: editionMeta ? editionMeta.numSections : 1,
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

function getDpcCache(): Map<string, Heading[]> {
  const cache: Map<string, Heading[]> = new Map();
  if (NODE_ENV !== 'development') {
    return cache;
  }

  if (!fs.existsSync(CACHE_PATH)) {
    return cache;
  }

  const stored = JSON.parse(fs.readFileSync(CACHE_PATH).toString());
  for (let [path, headings] of stored) {
    cache.set(path, headings);
  }

  return cache;
}

const CACHE_PATH = `${__dirname}/.dpc-cache.json`;

function persistDpcCache(dpcCache: Map<string, Heading[]>): void {
  fs.writeFileSync(CACHE_PATH, JSON.stringify([...dpcCache], null, 2));
}
