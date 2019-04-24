import { CommandBuilder, Arguments } from 'yargs';
import fs from 'fs-extra';
import path from 'path';
import { SourcePrecursor } from '@friends-library/types';
import { PublishOptions, publishPrecursors } from '../publish/handler';
import { builder as mainBuilder } from '../publish';

export const command = 'publish:ref [path]';

export const describe = 'publish reference asciidoc document at given path';

export const builder: CommandBuilder = function(yargs) {
  return mainBuilder(yargs).positional('path', {
    type: 'string',
    default: 'misc',
    describe: 'relative filepath to reference doc (from packages/kite/src/publish/ref)',
  });
};

export function handler(argv: Arguments<PublishOptions>): void {
  const precursor = getRefPrecursor(argv.path);
  publishPrecursors([precursor], argv);
}

function getRefPrecursor(doc: string): SourcePrecursor {
  return {
    id: 'ref',
    lang: 'en',
    adoc: fs.readFileSync(path.resolve(__dirname, `${doc}.adoc`)).toString(),
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
