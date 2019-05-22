import { SourcePrecursor, Job } from '@friends-library/types';
import uuid from 'uuid/v4';
import pick from 'lodash/pick';
import get from 'lodash/get';
import createSourceSpec from './source-spec';

export function createPrecursor(
  data: { [k in keyof SourcePrecursor]?: any } = {},
): SourcePrecursor {
  const metaProps = ['title', 'isbn', 'originalTitle', 'published', 'editor'];
  const revisionProps = ['timestamp', 'sha', 'url'];
  return {
    id: data.id || uuid(),
    config: data.config || {},
    customCss: data.customCss || {},
    filename: data.filename || 'document',
    revision: {
      timestamp: Math.floor(Date.now() / 1000),
      sha: '<UNKNOWN>',
      url: '#',
      ...(data.revision ? pick(data.revision, revisionProps) : {}),
    },
    lang: data.lang || 'en',
    adoc: data.adoc || '',
    meta: {
      title: 'Unknown Document',
      author: {
        name: get(data, 'meta.author.name', 'Unknown Author'),
        nameSort: get(data, 'meta.author.nameSort', 'Author, Unknown'),
      },
      ...(data.meta ? pick(data.meta, metaProps) : {}),
    },
  };
}

export function createJob(data: { [k in keyof Job]?: any } = {}): Job {
  const defaultMeta = {
    check: false,
    perform: false,
    condense: false,
    frontmatter: true,
    createEbookCover: false,
  };
  return {
    id: uuid(),
    filename: 'document--(print).pdf',
    target: 'pdf-print',
    spec: data.spec || createSourceSpec(createPrecursor()),
    meta: {
      ...defaultMeta,
      ...pick(get(data, 'meta', {}), Object.keys(defaultMeta)),
    },
    ...pick(data, ['id', 'filename', 'target']),
  };
}
