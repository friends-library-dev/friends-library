// @flow
import fs from 'fs-extra';
import { dirname, basename } from 'path';
import { Friend, Edition } from '@friends-library/friends';
import { prepare, getDocumentMeta, pdf } from '@friends-library/kite';
import type { FilePath, Asciidoc, Css, Sha } from '../../../../type';
import type { Job } from '../../../kite/src/type';

export function createJobs(
  friend: Friend,
  modifiedFiles: Array<FilePath>,
  prFiles: Map<FilePath, Asciidoc | Css>,
  sha: Sha,
  chapters: boolean = false,
): Array<*> {
  return [...modifiedFiles.reduce((jobs, file) => {
    const [docSlug, editionType] = file.split('/');
    const document = friend.documents.find(doc => doc.slug === docSlug);
    const edition = document.editions.find(ed => ed.type === editionType);

    if (chapters) {
      const chFilename = [
        document.slug,
        edition.type,
        `${basename(file, '.adoc')}.pdf`,
      ].join('--');
      const chapterJob = getJob(chFilename, edition, prFiles.get(file) || '', sha);
      jobs.set(file, chapterJob);
    }

    if (!jobs.has(edition.type)) {
      const editionFilename = `${document.slug}--${edition.type}.pdf`;
      const parts = [...prFiles.entries()].reduce((acc, [path, content]) => {
        if (path.indexOf(`${document.slug}/${edition.type}`) === 0) {
          acc.push({ path, content });
        }
        return acc;
      }, []);

      const adoc = parts
        .sort((a, b) => a.path < b.path ? -1 : 1)
        .map(({ content }) => content)
        .join('\n');

      jobs.set(edition.type, getJob(editionFilename, edition, adoc, sha));
    }

    return jobs;
  }, new Map()).values()];
}

function getJob(
  filenameBase: string,
  edition: Edition,
  adoc: Asciidoc,
  sha: Sha,
): Job {
  const shortSha = sha.substring(0, 7);
  const filename = `${shortSha}--${filenameBase}`;
  return {
    id: filename,
    filename,
    target: 'pdf-print',
    spec: prepare({
      id: filename,
      config: {},
      customCss: {},
      filename: basename(filename, '.pdf'),
      revision: {
        timestamp: Date.now() / 1000,
        sha: shortSha,
        url: '#',
      },
      lang: 'en',
      meta: getDocumentMeta(edition),
      adoc,
    }),
    meta: {
      check: false,
      perform: false,
      open: false,
      send: false,
      debugPrintMargins: false,
      condense: false,
      frontmatter: filename.split('--').length < 4,
    },
  };
}


export async function makePdfs(
  jobs: Array<Job>,
): Promise<Array<FilePath>> {
  const paths = [];
  for (let i = 0; i < jobs.length; i++) {
    // we do these serially to avoid running out of memory
    // eslint-disable-next-line no-await-in-loop
    const { pdf: pdfPath, srcDir } = await pdf.make(jobs[i]);
    paths.push(pdfPath);
    fs.removeSync(dirname(srcDir));
  }
  return Promise.resolve(paths);
}
