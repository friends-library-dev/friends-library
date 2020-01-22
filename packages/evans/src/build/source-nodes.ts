import '@friends-library/env/load';
import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import { PrintSize } from '@friends-library/types';
import { price } from '@friends-library/lulu';
import { fetch } from '@friends-library/document-meta';
import { query, hydrate } from '@friends-library/dpc-fs';
import { red } from '@friends-library/cli-utils/color';
import { allFriends, allDocsMap, cartItemData, justHeadings } from './helpers';
import { getDpcCache, persistDpcCache, EditionCache } from './dpc-cache';
import residences from './residences';
import * as url from '../lib/url';
import { getPartials } from '../lib/partials';
import { APP_ALT_URL, LANG } from '../env';

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
  const friends = allFriends().filter(f => f.lang === LANG && f.hasNonDraftDocument);
  const docs = allDocsMap();
  const dpcCache = getDpcCache();

  friends.forEach(friend => {
    const documents = friend.documents.filter(doc => doc.hasNonDraftEdition);
    const friendProps = {
      ...friend.toJSON(),
      friendId: friend.id,
      residences: residences(friend),
      url: url.friendUrl(friend),
    };

    createNode({
      ...friendProps,
      id: createNodeId(`friend-${friend.id}`),
      children: documents.map(d => createNodeId(`document-${d.id}`)),
      internal: {
        type: 'Friend',
        contentDigest: createContentDigest(friendProps),
      },
    });

    documents.forEach(document => {
      const documentProps: Record<string, any> = {
        ...document.toJSON(),
        url: url.documentUrl(document),
        authorUrl: url.friendUrl(friend),
        documentId: document.id,
        friendSlug: friend.slug,
        authorName: friend.name,
      };

      if (document.altLanguageId) {
        const altDoc = docs.get(document.altLanguageId);
        if (!altDoc) throw new Error(`Missing alt language doc from ${document.path}`);
        documentProps.altLanguageUrl = `${APP_ALT_URL}${url.documentUrl(altDoc)}`;
      }

      const filteredEditions = document.editions.filter(ed => !ed.isDraft);
      const editions = filteredEditions.map(edition => {
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
            hydrate.asciidoc(dpc, undefined, justHeadings);
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
          downloadUrl: {
            web_pdf: url.logDownloadUrl(edition, 'web-pdf'),
            epub: url.logDownloadUrl(edition, 'epub'),
            mobi: url.logDownloadUrl(edition, 'mobi'),
          },
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
                externalPlaylistIdHq: edition.audio.externalPlaylistIdHq || null,
                externalPlaylistIdLq: edition.audio.externalPlaylistIdLq || null,
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
