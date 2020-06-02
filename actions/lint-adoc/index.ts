import fs from 'fs';
import { lint } from '@friends-library/adoc-lint';
import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { newOrModifiedFiles } from '../helpers';
import { Annotation, toAnnotation, lintOptions } from './lint-helpers';
import * as pullRequest from '../pull-requests';
import { deleteBotCommentsContaining } from '../comments';

async function main() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const pull_number = pullRequest.number();
  if (!pull_number) {
    return;
  }

  const commitSha = pullRequest.latestCommitSha();
  if (!commitSha) {
    return;
  }

  deleteBotCommentsContaining('lint violations!', owner, repo, pull_number);

  let errors: Annotation[] = [];
  const client = new Octokit();

  newOrModifiedFiles().forEach(path => {
    const asciidoc = fs.readFileSync(path).toString();
    errors = [
      ...errors,
      ...lint(asciidoc, lintOptions(path)).map(l => toAnnotation(l, path)),
    ];
  });

  if (!errors.length) {
    return;
  }

  core.setFailed(`Found ${errors.length} lint error${errors.length > 1 ? 's' : ''}!`);
  console.error(errors);

  client.checks.create({
    owner,
    repo,
    name: 'lint-adoc',
    head_sha: commitSha,
    status: 'completed',
    conclusion: 'failure',
    output: {
      title: 'Asciidoc lint failure',
      summary: `Found ${errors.length} problems`,
      annotations: errors,
    },
  });

  client.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: `Found \`${errors.length}\` **lint violations!** :grimacing:\n\nCheck the [changed files](https://github.com/${owner}/${repo}/pull/${pull_number}/files) for comments showing exact violation details.`,
  });
}

main();
