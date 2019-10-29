import mapValues from 'lodash/mapValues';
import { DocPrecursor, FileManifest, EbookConfig } from '@friends-library/types';
import { removeMobi7Tags } from '@friends-library/doc-html';
import ebook from '../ebook';

export default async function epub(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest[]> {
  const ebookManifests = await ebook(dpc, conf);
  return epubFromEbook(ebookManifests);
}

export function epubFromEbook(manifests: FileManifest[]): FileManifest[] {
  return manifests.map(manifest =>
    mapValues(manifest, val => (typeof val === 'string' ? removeMobi7Tags(val) : val)),
  );
}
