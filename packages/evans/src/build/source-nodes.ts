import '@friends-library/env/load';
import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import filesize from 'filesize';
import { PrintSize } from '@friends-library/types';
import { price } from '@friends-library/lulu';
import { fetch } from '@friends-library/document-meta';
import { query, hydrate } from '@friends-library/dpc-fs';
import { red } from '@friends-library/cli-utils/color';
import {
  allFriends,
  allDocsMap,
  cartItemData,
  justHeadings,
  htmlTitle,
  htmlShortTitle,
} from './helpers';
import { getDpcCache, persistDpcCache, EditionCache } from './dpc-cache';
import residences from './residences';
import * as url from '../lib/url';
import { documentDate, periodFromDate, published } from '../lib/date';
import { documentRegion } from '../lib/region';
import { APP_ALT_URL, LANG } from '../env';

const humansize = filesize.partial({ round: 0, spacer: '' });

const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions: { createNode },
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const meta = await fetch();
  const friends = allFriends().filter(f => f.lang === LANG && f.hasNonDraftDocument);
  const docs = allDocsMap();
  const dpcCache = getDpcCache();

  friends.forEach(friend => {
    const documents = friend.documents.filter(doc => doc.hasNonDraftEdition);
    const friendProps = {
      ...friend.toJSON(),
      friendId: friend.id,
      residences: residences(friend.residences),
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
        htmlTitle: htmlTitle(document.title),
        htmlShortTitle: htmlShortTitle(document.title),
        region: documentRegion(document),
        date: documentDate(document),
        period: periodFromDate(documentDate(document)),
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
          process.exit(1);
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

        if (edition.audio && !editionMeta.audioFilesizes) {
          red(`Unexpected missing audio filesize data: ${edition.path}`);
        }

        if (!editionMeta.published) {
          red(`Unexpected missing publish date for edition: ${edition.path}`);
          process.exit(1);
        }

        return {
          ...edition.toJSON(),
          ...cartItemData(edition, pages),
          ...published(editionMeta.published, LANG),
          friendSlug: friend.slug,
          documentSlug: document.slug,
          printSize,
          pages,
          downloadUrl: {
            web_pdf: url.artifactDownloadUrl(edition, 'web-pdf'),
            epub: url.artifactDownloadUrl(edition, 'epub'),
            mobi: url.artifactDownloadUrl(edition, 'mobi'),
          },
          chapterHeadings: dpcData.headings,
          price: price(printSize, pages),
          customCode: dpcData.customCode,
          numChapters: editionMeta ? editionMeta.numSections : 1,
          audio: edition.audio
            ? {
                reader: edition.audio.reader,
                added: edition.audio.added.toISOString(),
                complete: edition.audio.complete,
                duration: edition.audio.duration,
                publishedDate: published(edition.audio.added.toISOString(), LANG)
                  .publishedDate,
                parts: edition.audio.parts.map(part => part.toJSON()),
                m4bFilesizeHq: humansize(editionMeta.audioFilesizes?.m4bHq || 0),
                m4bFilesizeLq: humansize(editionMeta.audioFilesizes?.m4bLq || 0),
                mp3ZipFilesizeHq: humansize(editionMeta.audioFilesizes?.mp3ZipHq || 0),
                mp3ZipFilesizeLq: humansize(editionMeta.audioFilesizes?.mp3ZipLq || 0),
                m4bUrlHq: url.m4bDownloadUrl(edition.audio, 'HQ'),
                m4bUrlLq: url.m4bDownloadUrl(edition.audio, 'LQ'),
                mp3ZipUrlHq: url.mp3ZipDownloadUrl(edition.audio, 'HQ'),
                mp3ZipUrlLq: url.mp3ZipDownloadUrl(edition.audio, 'LQ'),
                podcastUrlHq: url.podcastUrl(edition.audio, 'HQ'),
                podcastUrlLq: url.podcastUrl(edition.audio, 'LQ'),
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
