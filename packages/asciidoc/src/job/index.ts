import { SourcePrecursor } from '@friends-library/types';
import uuid from 'uuid/v4';
import pick from 'lodash/pick';
import get from 'lodash/get';

export function createPrecursor(data: Partial<SourcePrecursor> = {}): SourcePrecursor {
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
      // @ts-ignore
      author: {
        name: get(data, 'meta.author.name', 'Unknown Author'),
        nameSort: get(data, 'meta.author.nameSort', 'Author, Unknown'),
      },
      ...(data.meta ? pick(data.meta, metaProps) : {}),
    },
  };
}
