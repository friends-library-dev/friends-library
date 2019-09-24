import { Edition } from '@friends-library/friends';
import { DocumentMeta, Job } from '@friends-library/types';

export function getDocumentMeta(edition: Edition): DocumentMeta {
  const { document } = edition;
  const { friend } = document;
  const coverEdition = friend.lang === 'es' ? 'spanish' : edition.type;
  return {
    title: document.title,
    coverId: `${friend.slug}/${document.slug}/${coverEdition}`,
    author: {
      name: friend.name,
      nameSort: friend.alphabeticalName(),
    },
    ...(document.originalTitle ? { originalTitle: document.originalTitle } : {}),
    ...(document.published ? { published: document.published } : {}),
    ...(edition.isbn ? { isbn: edition.isbn } : {}),
    ...(edition.editor ? { editor: edition.editor } : {}),
  };
}

export function jobToJson(job: Job): { [k in keyof Job]?: any } {
  return {
    ...job,
    spec: {
      ...job.spec,
      notes: [...job.spec.notes],
    },
  };
}

export function unstringifyJob(str: string): Job {
  const job = JSON.parse(str);
  job.spec.notes = new Map(job.spec.notes);
  return job;
}