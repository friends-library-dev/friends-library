import stripIndent from 'strip-indent';
import {
  DocPrecursor,
  FileManifest,
  Html,
  PaperbackInteriorOptions,
} from '@friends-library/types';
import { paperbackInterior as html } from '@friends-library/doc-html';

export default async function paperbackInteriorManifests(
  dpc: DocPrecursor,
  options: PaperbackInteriorOptions = {},
): Promise<FileManifest[]> {
  console.log('over here');
  return [
    {
      'doc.html': html(dpc, 0, options),
      'doc.css': 'h1 { color: red; }',
    },
  ];
}

function wrapHtmlBody(bodyHtml: Html): Html {
  return stripIndent(`
    <!DOCTYPE html>
    <html>
    <head><link href="doc.css" rel="stylesheet" type="text/css">
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `).trim();
}
