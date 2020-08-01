import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import * as pr from '../pull-requests';

async function main(): Promise<void> {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || ``).split(`/`);

  const PR_NUM = await pr.number();
  if (!PR_NUM) {
    core.warning(`No associated PR for commit`);
    return;
  }

  const siteId = process.env.INPUT_SITE_ID;
  if (!siteId) {
    core.warning(`Missing site id`);
    return;
  }

  core.info(`Using PR number: ${PR_NUM}`);
  core.info(`Using site id: ${siteId}`);

  const { data: labels } = await new Octokit().issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: PR_NUM,
  });

  const shouldDeploy = !!labels.find((l) => l.name === `deploy:${siteId}`);
  core.setOutput(`should_deploy_${siteId}`, shouldDeploy);
  core.info(`Set \`should_deploy_${siteId}\` output to ${shouldDeploy}`);

  const deployContext =
    process.env.GITHUB_REF === `refs/heads/master` ? `production` : `preview`;
  core.setOutput(`deploy_context`, deployContext);
  core.info(`Set \`deploy_context\` output to ${deployContext}`);
}

main();
