// @flow
import type { Job, SourcePrecursor, Asciidoc } from '../type';
import { prepare } from './spec';
import { createCommand } from '.';


export function testJob(adoc: ?Asciidoc = null): Job {
  return {
    id: 'test-job',
    spec: prepare(testPrecursor(adoc)),
    target: 'epub',
    filename: 'test.epub',
    cmd: createCommand({
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
    adoc: adoc || '== Chapter 1\n\nWe parted friendly.footnote:[A note.]\n',
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
      url: 'https://github.com/friends-library-docs/test/tree/fb0c71b/doc/edition',
    },
  };
}
