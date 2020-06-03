import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import * as pr from '../pull-requests';

async function main() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');

  // this order was carefully tested and ensures we get the right commit
  // when opening and syncing a pull request, AND when merging (any merge type)
  const COMMIT_SHA = pr.latestCommitSha() || process.env.GITHUB_SHA || '';

  const PR_NUM = (await pr.numberFromCommitSha(COMMIT_SHA, owner, repo)) || pr.number();
  if (!PR_NUM) {
    core.warning('No associated PR for commit');
    return;
  }

  const siteId = process.env.INPUT_SITE_ID;
  if (!siteId) {
    core.warning(`Missing site id`);
    return;
  }

  core.info(`Using commit sha: ${COMMIT_SHA}`);
  core.info(`Using PR number: ${PR_NUM}`);
  core.info(`Using site id: ${siteId}`);

  const { data: labels } = await new Octokit().issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: PR_NUM,
  });

  const shouldDeploy = !!labels.find(l => l.name === `deploy:${siteId}`);
  core.setOutput(`should_deploy_${siteId}`, shouldDeploy);
  core.info(`Set output.should_deploy_${siteId} = ${shouldDeploy}`);
}

main();
