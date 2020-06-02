import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/action';
import { pdf } from '@friends-library/doc-artifacts';
import { uploadFile } from '@friends-library/cloud';
import { DocPrecursor } from '@friends-library/types';
import { processDocument } from '@friends-library/adoc-convert';
import { paperbackInterior } from '@friends-library/doc-manifests';
import { newOrModifiedFiles } from '../helpers';
import * as pullRequest from '../pull-requests';
import { deleteBotCommentsContaining } from '../comments';

async function main() {
  const COMMIT_SHA = pullRequest.latestCommitSha();
  const PR_NUM = pullRequest.number();
  if (!COMMIT_SHA || !PR_NUM) {
    return;
  }

  const { GITHUB_REPOSITORY = '' } = process.env;
  const [owner, repo] = GITHUB_REPOSITORY.split('/');
  const uploaded: [string, string][] = [];

  for (let file of newOrModifiedFiles()) {
    const filename = path.basename(file);
    const adoc = fs.readFileSync(file).toString();
    const dpc = dpcFromAdocFragment(adoc, GITHUB_REPOSITORY);
    const [manifest] = await paperbackInterior(dpc, {
      frontmatter: false,
      printSize: 'm',
      condense: false,
      allowSplits: false,
    });

    const pdfPath = await pdf(manifest, `doc_${Date.now()}`);
    const [, edition] = file.split('/');
    const cloudFilename = `${COMMIT_SHA.substr(0, 8)}--${edition}--${filename}`;
    const url = await uploadFile(pdfPath, `actions/${repo}/${PR_NUM}/${cloudFilename}`);
    uploaded.push([url, cloudFilename]);
  }

  if (uploaded.length) {
    deleteBotCommentsContaining('PDF Previews for commit', owner, repo, PR_NUM);
    await new Octokit().issues.createComment({
      owner,
      repo,
      issue_number: PR_NUM,
      body: `PDF Previews for commit ${COMMIT_SHA}:\n\n${uploaded
        .map(([url, filename]) => `* [${filename}](${url})`)
        .join('\n')}`,
    });
  }
}

main();

function dpcFromAdocFragment(adoc: string, repoOwner: string): DocPrecursor {
  const { epigraphs, sections, notes } = processDocument(adoc);
  return {
    lang: repoOwner === 'biblioteca-de-los-amigos' ? 'es' : 'en',
    friendSlug: 'test',
    friendInitials: ['F', 'P'],
    documentSlug: 'test',
    path: 'test',
    documentId: 'test',
    editionType: 'original',
    asciidoc: adoc,
    epigraphs,
    sections,
    notes,
    paperbackSplits: [],
    printSize: 'm',
    isCompilation: false,
    blurb: '',
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: 'Test Document',
      isbn: '',
      author: {
        name: 'Test Author',
        nameSort: '',
      },
    },
    revision: {
      timestamp: Date.now(),
      sha: '',
      url: '',
    },
  };
}
