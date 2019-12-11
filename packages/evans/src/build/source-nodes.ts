import '@friends-library/env/load';
import fs from 'fs';
import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import env from '@friends-library/env';
import { price } from '@friends-library/lulu';
import { fetch } from '@friends-library/document-meta';
import { query, hydrate } from '@friends-library/dpc-fs';
import { red } from '@friends-library/cli-utils/color';
import { allFriends, allDocsMap } from './helpers';
import * as url from '../lib/url';
import { getPartials } from '../lib/partials';
import { PrintSize, Heading, DocPrecursor } from '@friends-library/types';
import { NODE_ENV, APP_ALT_URL, LANG } from '../env';
import { Edition } from '@friends-library/friends';

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
  const friends = allFriends().filter(f => f.lang === LANG);
  const docs = allDocsMap();
  const dpcCache = getDpcCache();

  friends.forEach(friend => {
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

      const editions = document.editions.map(edition => {
        const editionMeta = meta.get(edition.path);
        let printSize: PrintSize = 'm';
        let pages = [175];
        if (editionMeta) {
          printSize = editionMeta.paperback.size;
          pages = editionMeta.paperback.volumes;
        } else {
          red(`Edition meta not found for ${edition.path}`);
        }

        let dpcData: EditionCache = dpcCache.get(edition.path) || {
          headings: [],
          customCode: { css: {}, html: {} },
        };
        if (dpcData.headings.length === 0) {
          const [dpc] = query.getByPattern(edition.path);
          if (dpc) {
            hydrate.asciidoc(dpc);
            hydrate.process(dpc);
            hydrate.customCode(dpc);
            dpcCache.set(edition.path, {
              headings: dpc.sections.map(sect => sect.heading),
              customCode: dpc.customCode,
            });
            persistDpcCache(dpcCache);
          }
        }

        return {
          ...edition.toJSON(),
          ...cartItemData(edition, pages),
          friendSlug: friend.slug,
          documentSlug: document.slug,
          printSize,
          pages,
          chapterHeadings: dpcData.headings,
          price: price(printSize, pages),
          customCode: dpcData.customCode,
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
      });

      createNode({
        ...documentProps,
        editions,
        id: createNodeId(`document-${document.id}`),
        parent: createNodeId(`friend-${friend.id}`),
        internal: {
          type: 'Document',
          contentDigest: createContentDigest(documentProps),
        },
      });
    });
  });
};

export default sourceNodes;

function cartItemData(edition: Edition, pages: number[]): Record<string, string[]> {
  const isMulti = pages.length > 1;
  const vols = pages.map((_, idx) => idx + 1);
  const cloudUrl = env.require('CLOUD_STORAGE_BUCKET_URL').CLOUD_STORAGE_BUCKET_URL;
  const url = `${cloudUrl}/${edition.path}`;
  return {
    cartItemTitles: vols.map(
      v => `${edition.document.title}${isMulti ? `, vol. ${v}` : ''}`,
    ),
    cartItemInteriorPdfUrls: vols.map(
      v => `${url}/${edition.filename('paperback-interior', isMulti ? v : undefined)}`,
    ),
    cartItemCoverPdfUrls: vols.map(
      v => `${url}/${edition.filename('paperback-cover', isMulti ? v : undefined)}`,
    ),
  };
}

function getDpcCache(): Map<string, EditionCache> {
  const cache: Map<string, EditionCache> = new Map();
  if (NODE_ENV !== 'development') {
    return cache;
  }

  if (!fs.existsSync(CACHE_PATH)) {
    return cache;
  }

  const stored = JSON.parse(fs.readFileSync(CACHE_PATH).toString());
  for (let [path, edCache] of stored) {
    cache.set(path, edCache);
  }

  return cache;
}

const CACHE_PATH = `${__dirname}/.dpc-cache.json`;

function persistDpcCache(dpcCache: Map<string, EditionCache>): void {
  if (NODE_ENV === 'development') {
    fs.writeFileSync(CACHE_PATH, JSON.stringify([...dpcCache], null, 2));
  }
}

interface EditionCache {
  headings: Heading[];
  customCode: DocPrecursor['customCode'];
}
