import fetch, { Response } from 'node-fetch';
import {
  createJob,
  createSourceSpec,
  createPrecursor,
  getDocumentMeta,
  jobToJson,
} from '@friends-library/asciidoc';
import { Friend, Edition } from '@friends-library/friends';
import { basename } from 'path';
import { FilePath, Asciidoc, Sha, Uuid, Job } from '@friends-library/types';
import { ModifiedAsciidocFile } from './type';
import JobListener from './job-listener';
import logger from './log';

const {
  env: { API_URL },
} = process;

export function submit(body: { job: Job; uploadPath: string }): Promise<Uuid | false> {
  return fetch(`${API_URL || ''}/kite-jobs`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uploadPath: body.uploadPath,
      job: jobToJson(body.job),
    }),
  })
    .then(res => res.json())
    .then(({ id }) => id)
    .catch(e => {
      logger.error(e, 'POST /kite-jobs error');
      return false;
    });
}

export function destroy(id: Uuid): Promise<Response> {
  return fetch(`${API_URL || ''}/kite-jobs/${id}`, {
    method: 'delete',
  });
}

export function listenAll(ids: Uuid[]): JobListener {
  return new JobListener(ids);
}

export function fromPR(
  friend: Friend,
  modifiedFiles: ModifiedAsciidocFile[],
  prFiles: Map<FilePath, Asciidoc>,
  sha: Sha,
  chapters: boolean = false,
  books: boolean = true,
): Array<Job> {
  return [
    ...modifiedFiles
      .reduce((jobs, file) => {
        const [docSlug, editionType] = file.path.split('/');
        const document = friend.documents.find(doc => doc.slug === docSlug);
        if (!document) {
          throw new Error(`Unable to find document with slug ${docSlug}`);
        }

        const edition = document.editions.find(ed => ed.type === editionType);
        if (!edition) {
          throw new Error(`Unable to find edition with type ${editionType}`);
        }

        // logging the friend deletes these references ¯\_(ツ)_/¯
        // @see https://github.com/friends-library/friends-library/issues/167
        document.friend = friend;
        edition.document = document;

        if (chapters) {
          const chFilename = [
            document.slug,
            edition.type,
            `${basename(file.path, '.adoc')}.pdf`,
          ].join('--');
          const chapterJob = getJob(
            chFilename,
            edition,
            prFiles.get(file.path) || '',
            sha,
          );
          jobs.set(file, chapterJob);
        }

        if (books && !jobs.has(edition.type)) {
          const editionFilename = `${document.slug}--${edition.type}.pdf`;
          const relevantFiles = getRelevantFiles(prFiles, edition);
          const adoc = joinAdoc(relevantFiles);
          jobs.set(edition.type, getJob(editionFilename, edition, adoc, sha));
        }

        return jobs;
      }, new Map())
      .values(),
  ];
}

function joinAdoc(files: ModifiedAsciidocFile[]): Asciidoc {
  return files
    .sort((a, b) => (a.path < b.path ? -1 : 1))
    .map(({ adoc }) => adoc)
    .join('\n');
}

function getRelevantFiles(
  prFiles: Map<FilePath, Asciidoc>,
  edition: Edition,
): ModifiedAsciidocFile[] {
  return [...prFiles]
    .filter(([path]) => {
      if (!path.match(/\.adoc$/)) {
        return false;
      }
      return path.indexOf(`${edition.document.slug}/${edition.type}`) === 0;
    })
    .map(([path, adoc]) => ({ path, adoc }));
}

function getJob(filenameBase: string, edition: Edition, adoc: Asciidoc, sha: Sha): Job {
  const shortSha = sha.substring(0, 7);
  const filename = `${shortSha}--${filenameBase}`;
  return createJob({
    filename,
    target: 'pdf-print',
    spec: createSourceSpec(
      createPrecursor({
        id: filename,
        filename: basename(filename, '.pdf'),
        revision: { sha: shortSha },
        meta: getDocumentMeta(edition),
        customCss: { 'pdf-print': '.embedded-content-document { background: pink; }' },
        adoc,
      }),
    ),
    meta: { frontmatter: filename.split('--').length < 4 },
  });
}
