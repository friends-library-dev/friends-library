import fs from 'fs';
import { lint } from '@friends-library/adoc-lint';
import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { newOrModifiedFiles } from '../helpers';
import { Annotation, toAnnotation, lintOptions } from './lint-helpers';
import * as pr from '../pull-requests';
import { latestCommitSha } from '../helpers';

async function main(): Promise<void> {
  const prNumber = await pr.number();
  if (!prNumber) {
    return;
  }

  await pr.deleteBotCommentsContaining(`lint violations!`);

  let errors: Annotation[] = [];
  newOrModifiedFiles().forEach((path) => {
    const asciidoc = fs.readFileSync(path).toString();
    errors = [
      ...errors,
      ...lint(asciidoc, lintOptions(path)).map((l) => toAnnotation(l, path)),
    ];
  });

  if (!errors.length) {
    core.info(`Found 0 lint errors.`);
    return;
  }

  core.setFailed(`Found ${errors.length} lint error${errors.length > 1 ? `s` : ``}!`);
  console.error(errors);

  const [owner, repo] = (process.env.GITHUB_REPOSITORY || ``).split(`/`);
  const client = new Octokit();

  await client.checks.create({
    owner,
    repo,
    name: `lint-adoc`,
    head_sha: latestCommitSha() || ``,
    status: `completed`,
    conclusion: `failure`,
    output: {
      title: `Asciidoc lint failure`,
      summary: `Found ${errors.length} problems`,
      annotations: errors,
    },
  });

  await client.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `Found \`${errors.length}\` **lint violations!** :grimacing:\n\nCheck the [changed files](https://github.com/${owner}/${repo}/pull/${prNumber}/files) for comments showing exact violation details.`,
  });
}

main();
