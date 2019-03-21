// @flow
import { createSourceSpec } from '@friends-library/asciidoc';
import type { Asciidoc } from '../../../../type';
import type { Job, SourcePrecursor } from '../type';
import { createCommand } from './cli';

export function testJob(adoc: ?Asciidoc = null): Job {
  return {
    id: 'test-job',
    spec: createSourceSpec(testPrecursor(adoc)),
    target: 'epub',
    filename: 'test.epub',
    meta: createCommand({
      perform: true,
    }),
  };
}


export function testPrecursor(adoc: ?Asciidoc = null): SourcePrecursor {
  return {
    id: 'test/doc',
    lang: 'en',
    filename: 'test-filename',
    config: {},
    customCss: {},
    adoc: adoc || '== C1\n\nPara.\n\n== C2\n\nPara.footnote:[A note.]',
    meta: {
      title: 'Test Doc',
      author: {
        name: 'George Fox',
        nameSort: 'Fox, George',
      },
    },
    revision: {
      timestamp: Math.floor(Date.now() / 1000),
      sha: 'fb0c71b',
      url: 'https://github.com/friends-library/test/tree/fb0c71b/doc/edition',
    },
  };
}
