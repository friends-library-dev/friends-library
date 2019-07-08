import { sync as glob } from 'glob';
import { SourcePrecursor, PrintSize } from '@friends-library/types';
import { buildPrecursor } from '../publish/precursors';
import { PublishPrecursorOpts } from '../publish/handler';
import { SourceDocument, getMeta } from './handler';
import { bookSizes } from '@friends-library/asciidoc';

export function precursorFromSourceDoc(asset: SourceDocument): SourcePrecursor {
  const { friend, document, edition } = asset;
  return buildPrecursor(friend.lang, friend.slug, document.slug, edition.type);
}

export async function publishOpts(
  sourceDoc: SourceDocument,
  precursor: SourcePrecursor,
): Promise<PublishPrecursorOpts> {
  const meta = await getMeta();
  const sections = glob(`${sourceDoc.fullPath}/*.adoc`).length;
  const length = precursor.adoc.length;

  let printSize: PrintSize = 'xl';
  if (meta.estimatePages(length, sections, 's') < bookSizes.s.maxPages) {
    printSize = 's';
  } else if (meta.estimatePages(length, sections, 'm') < bookSizes.m.maxPages) {
    printSize = 'm';
  }

  return {
    perform: true,
    check: true,
    noFrontmatter: false,
    condense: printSize === 'xl' && length > 1000000,
    createEbookCover: true,
    printSize,
    open: false,
    email: '',
    send: false,
    target: ['pdf-print', 'pdf-web', 'epub', 'mobi'],
  };
}
