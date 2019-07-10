import { SourcePrecursor, PrintSize } from '@friends-library/types';
import { buildPrecursor } from '../publish/precursors';
import { PublishPrecursorOpts } from '../publish/handler';
import { shouldCondense } from './pdf';
import { SourceDocument } from './source';

export function precursorFromSourceDoc(asset: SourceDocument): SourcePrecursor {
  const { friend, document, edition } = asset;
  return buildPrecursor(friend.lang, friend.slug, document.slug, edition.type);
}

export type PublishOptions = PublishPrecursorOpts & { printSize: PrintSize };

export function publishOpts(
  printSize: PrintSize,
  adocLength: number,
  check: boolean,
): PublishOptions {
  return {
    perform: true,
    check,
    noFrontmatter: false,
    condense: shouldCondense(printSize, adocLength),
    createEbookCover: true,
    printSize,
    open: false,
    email: '',
    send: false,
    target: ['pdf-print', 'pdf-web', 'epub', 'mobi'],
  };
}
