import {
  DocPrecursor,
  FileManifest,
  PaperbackInteriorConfig,
} from '@friends-library/types';
import { paperbackInterior as html } from '@friends-library/doc-html';
import { paperbackInterior as css } from '@friends-library/doc-css';

export default async function paperbackInteriorManifests(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig,
): Promise<FileManifest[]> {
  return [
    {
      'doc.html': html(dpc, 0, conf),
      'doc.css': css(dpc, conf),
      'line.svg':
        '<svg height="1px" width="88px" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="88" y2="0" style="stroke:rgb(0,0,0);stroke-width:1" /></svg>',
    },
  ];
}
