import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import * as pr from '../pull-requests';

// console.log(pr.latestCommitSha());
// console.log(process.env.GITHUB_SHA);

async function main() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const COMMIT_SHA = pr.latestCommitSha() || process.env.GITHUB_SHA || '';
  console.log('use commit_sha:', COMMIT_SHA);
  const PR_NUM = (await pr.numberFromCommitSha(COMMIT_SHA, owner, repo)) || pr.number();
  if (!PR_NUM) {
    console.log('No associated PR for commit');
    return;
  }

  const siteId = process.env.INPUT_SITE_ID;
  if (!siteId) {
    console.log(`Missing site id`);
    return;
  }
  console.log('site id:', siteId);

  console.log('found PR num:', PR_NUM);
  const { data: labels } = await new Octokit().issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: PR_NUM,
  });

  labels.forEach(label => {
    if (label.name === `deploy:${siteId}`) {
      console.log('setting env var!');
      core.exportVariable(`DEPLOY_${siteId.toUpperCase()}`, 'true');
    }
  });
}

main();
// pull request sync:
// pull request sync: correct one was `latestCommitSha()`

// push event (to master) (MERGE COMMIT)
// latestCommitSha was `false`
// GITHUB_SHA was merge commit
// merge_commit SHA gave good result when listing PRs for commit 👍

// pull request open (multiple commits)
// latestCommitSha was correct
// GITHUB_SHA incorrect

// push event (to master) (REBASE AND MERGE)
// latestCommitSha was `false`
// GITHUB_SHA was correct for rebased new tip
// rebased sha gave good results for list pRS for commit 👍

// push event (to master) (SQUASH AND MERGE)
// latestCommitSha was `false`
// GITHUB_SHA was correct for squashed new tip
// rebased sha gave good results for list pRS for commit 👍

// ${{ github.event_name }}
