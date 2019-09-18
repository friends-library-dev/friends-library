import mapValues from 'lodash/mapValues';
import { DocPrecursor, FileManifest, EbookConfig } from '@friends-library/types';
import { removeMobi7Tags } from '@friends-library/doc-html';
import ebook from '../ebook';
// import { epub as html } from '@friends-library/doc-html';
// import { epub as css } from '@friends-library/doc-css';

export default async function epub(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest[]> {
  return [mapValues(await ebook(dpc, conf), removeMobi7Tags)];
}
