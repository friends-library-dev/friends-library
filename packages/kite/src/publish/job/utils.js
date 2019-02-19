// @flow
import { Edition } from '@friends-library/friends';
import type { DocumentMeta, Job } from '../../type';

export function getDocumentMeta(edition: Edition): DocumentMeta {
  const { document } = edition;
  const { friend } = document;
  return {
    title: document.title,
    author: {
      name: friend.name,
      nameSort: friend.alphabeticalName(),
    },
    ...document.originalTitle ? { originalTitle: document.originalTitle } : {},
    ...document.published ? { published: document.published } : {},
    ...edition.isbn ? { isbn: edition.isbn } : {},
    ...edition.editor ? { editor: edition.editor } : {},
  };
}

export function stringifyJob(job: Job): string {
  return JSON.stringify({
    ...job,
    spec: {
      ...job.spec,
      notes: [...job.spec.notes],
    },
  });
}

export function unstringifyJob(str: string): Job {
  const job = JSON.parse(str);
  job.spec.notes = new Map(job.spec.notes);
  return job;
}
