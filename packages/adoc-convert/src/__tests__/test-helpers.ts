import createSourceSpec from '../source-spec';
import { Asciidoc, SourceSpec, SourcePrecursor, Job } from '@friends-library/types';
import { createJob } from '..';

export function jobFromAdoc(adoc?: Asciidoc): Job {
  return createJob({ spec: specFromAdoc(adoc) });
}

export function specFromAdoc(adoc?: Asciidoc): SourceSpec {
  return createSourceSpec(precursor(adoc));
}

export function precursor(
  adoc: Asciidoc = '== C1\n\nPara.\n\n== C2\n\nPara.footnote:[A note.]',
): SourcePrecursor {
  return {
    id: 'test/doc',
    lang: 'en',
    filename: 'test-filename',
    config: {},
    customCss: {},
    adoc,
    meta: {
      title: 'Test Doc',
      coverId: '',
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
