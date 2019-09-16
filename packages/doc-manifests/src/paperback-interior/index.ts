import {
  DocPrecursor,
  FileManifest,
  PaperbackInteriorConfig,
} from '@friends-library/types';
import { paperbackInterior as html } from '@friends-library/doc-html';

export default async function paperbackInteriorManifests(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig = {},
): Promise<FileManifest[]> {
  return [
    {
      'doc.html': html(dpc, 0, conf),
      'doc.css': 'h1 { color: red; }',
    },
  ];
}
