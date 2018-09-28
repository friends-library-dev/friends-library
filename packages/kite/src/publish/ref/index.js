// @flow
import fs from 'fs-extra';
import path from 'path';
import type { SourcePrecursor } from '../../type';
import { createCommand, publishPrecursors } from '..';

export default function publishRef(argv: Object): Promise<*> {
  const cmd = createCommand(argv);
  const precursor = getRefPrecursor();
  return publishPrecursors([precursor], cmd);
}


function getRefPrecursor(): SourcePrecursor {
  return {
    id: 'ref',
    lang: 'en',
    adoc: fs.readFileSync(path.resolve(__dirname, 'ref.adoc')).toString(),
    revision: {
      timestamp: Math.floor(Date.now() / 1000),
      sha: 'fb0c71b',
      url: 'https://github.com/ref/test/tree/fb0c71b/doc/edition',
    },
    config: {},
    customCss: {
      'pdf-print': '.sect1 { page-break-before: avoid; }',
    },
    filename: 'test',
    meta: {
      title: 'Reference Document',
      isbn: '978-1-64476-000-0',
      author: {
        name: 'Thomas Kite',
        nameSort: 'Kite, Thomas',
      },
    },
  };
}
