// @flow
import path from 'path';
import { Friend, Edition } from '@friends-library/friends';
import { prepare, getDocumentMeta, pdf, resetPublishDir, PUBLISH_DIR } from '@friends-library/kite';
import type { Slug, FilePath, Asciidoc, Css, Lang, Sha } from '../../../../type';
import type { Job, SourcePrecursor } from '../../../../packages/kite/src/type';

export function createJobs(
  friend: Friend,
  modifiedFiles: Array<FilePath>,
  prFiles: Map<FilePath, Asciidoc | Css>
): Array<*> {
  return [...modifiedFiles.reduce((jobs, file) => {
    const [docSlug, editionType] = file.split('/');
    const document = friend.documents.find(doc => doc.slug === docSlug);
    const edition = document.editions.find(ed => ed.type === editionType);
    const chapterFilename = [
      document.slug,
      edition.type,
      `${path.basename(file, '.adoc')}.pdf`,
    ].join('--');
    const chapterJob = getJob(chapterFilename, edition, prFiles.get(file) || '');
    jobs.set(file, chapterJob);

    if (!jobs.has(edition.type)) {
      const editionFilename = `${document.slug}--${edition.type}.pdf`;
      const adoc = [...prFiles.entries()].reduce((acc, [path, content]) => {
        if (path.indexOf(`${document.slug}/${edition.type}`) === 0) {
          return `${acc}\n${content}`;
        }
        return acc;
      }, '');
      jobs.set(edition.type, getJob(editionFilename, edition, adoc));
    }

    return jobs;
  }, new Map()).values()];
}

function getJob(
  filename: string,
  edition: Edition,
  adoc: Asciidoc,
): Job {
  return {
    id: filename,
    filename,
    target: 'pdf-print',
    spec: prepare({
      id: filename,
      config: {},
      customCss: {},
      filename,
      revision: {
        timestamp: Date.now(),
        sha: 'pr-test',
        url: '#',
      },
      lang: 'en',
      meta: getDocumentMeta(edition),
      adoc,
    }),
    cmd: {
      targets: [],
      check: false,
      perform: false,
      open: false,
      send: false,
      debugPrintMargins: false,
      condense: false,
      frontmatter: filename.split('--').length < 3,
    },
  };
}


export async function makePdfs(jobs: Array<Job>): Promise<Array<FilePath>> {
  resetPublishDir();
  return await Promise.all(jobs.map(pdf.make)).then(filenames => {
    return filenames.map(filename => `${PUBLISH_DIR}/${filename}`);
  });
}
