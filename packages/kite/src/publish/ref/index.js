// @flow
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
    adoc: '== Hello World\n\nTest paragraph.footnote:[A note.]',
    revision: {
      timestamp: Math.floor(Date.now() / 1000),
      sha: 'fb0c71b',
      url: 'https://github.com/ref/test/tree/fb0c71b/doc/edition',
    },
    config: {},
    filename: 'test',
    meta: {
      title: 'Reference Document',
      author: {
        name: 'Thomas Kite',
        nameSort: 'Kite, Thomas',
      },
    },
  };
}
