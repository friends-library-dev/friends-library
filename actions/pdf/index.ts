import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/action';
import { pdf } from '@friends-library/doc-artifacts';
import { uploadFile } from '@friends-library/cloud';
import { DocPrecursor } from '@friends-library/types';
import { processDocument } from '@friends-library/adoc-convert';
import { paperbackInterior } from '@friends-library/doc-manifests';
import { newOrModifiedFiles, latestCommitSha } from '../helpers';
import * as pr from '../pull-requests';

async function main(): Promise<void> {
  const COMMIT_SHA = latestCommitSha();
  const PR_NUM = await pr.number();
  if (!COMMIT_SHA || !PR_NUM) {
    return;
  }

  const { GITHUB_REPOSITORY = `` } = process.env;
  const [owner, repo] = GITHUB_REPOSITORY.split(`/`);
  const uploaded: [string, string][] = [];

  for (const file of newOrModifiedFiles()) {
    const filename = path.basename(file);
    const adoc = fs.readFileSync(file).toString();
    const dpc = dpcFromAdocFragment(adoc, owner, repo);
    const [manifest] = await paperbackInterior(dpc, {
      frontmatter: false,
      printSize: `m`,
      condense: false,
      allowSplits: false,
    });

    const pdfPath = await pdf(manifest, `doc_${Date.now()}`);
    const [, edition] = file.split(`/`);
    const cloudFilename = `${COMMIT_SHA.substr(0, 8)}--${edition}--${filename}`;
    const url = await uploadFile(pdfPath, `actions/${repo}/${PR_NUM}/${cloudFilename}`);
    uploaded.push([url, cloudFilename]);
  }

  if (uploaded.length) {
    await pr.deleteBotCommentsContaining(`PDF Previews for commit`);
    await new Octokit().issues.createComment({
      owner,
      repo,
      issue_number: PR_NUM,
      body: `PDF Previews for commit ${COMMIT_SHA}:\n\n${uploaded
        .map(([url, filename]) => `* [${filename}](${url})`)
        .join(`\n`)}`,
    });
  }
}

main();

function dpcFromAdocFragment(adoc: string, owner: string, repo: string): DocPrecursor {
  const { epigraphs, sections, notes } = processDocument(adoc);
  return {
    lang: owner === `biblioteca-de-los-amigos` ? `es` : `en`,
    friendSlug: `test`,
    friendInitials: [`F`, `P`],
    documentSlug: `test`,
    path: `test`,
    documentId: `test`,
    editionType: `original`,
    asciidoc: adoc,
    epigraphs,
    sections,
    notes,
    paperbackSplits: [],
    printSize: `m`,
    isCompilation: false,
    blurb: ``,
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: `Test Document`,
      isbn: ``,
      author: {
        name: repo
          .split(`-`)
          .map(([first, ...rest]) => first.toUpperCase() + rest.join(``))
          .join(` `),
        nameSort: ``,
      },
    },
    revision: {
      timestamp: Date.now(),
      sha: ``,
      url: ``,
    },
  };
}
