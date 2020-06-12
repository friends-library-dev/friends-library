import * as core from '@actions/core';
import { latestCommitSha } from '../helpers';
import * as pr from '../pull-requests';

// @ts-ignore
import NetlifyAPI from 'netlify';

async function main(): Promise<void> {
  const {
    INPUT_NETLIFY_API_TOKEN: token,
    INPUT_SITE_ID: siteId,
    INPUT_BUILD_DIR: buildDir,
    INPUT_FUNCTIONS_DIR: fnsDir,
    GITHUB_WORKSPACE: monorepoRoot,
    GITHUB_REF,
  } = process.env;

  const refIsNotMaster = GITHUB_REF !== `refs/heads/master`;
  const client = new NetlifyAPI(token);
  const shortSha = (latestCommitSha() || ``).substr(0, 8);
  const prData = await pr.data();
  if (!prData) {
    core.setFailed(`Failed to find pull request data for deploy`);
    return;
  }

  const { number: prNumber, title: prTitle } = prData;
  let message = `Push commit @${shortSha}`;
  if (prNumber && refIsNotMaster) {
    message = `PR #${prNumber}@${shortSha} "${prTitle}"`;
  } else if (prNumber && !refIsNotMaster) {
    message = `Merge PR#${prNumber}@${shortSha} to master`;
  }

  core.info(`GITHUB_REF: ${GITHUB_REF}`);
  core.info(`Deploying build dir: ${monorepoRoot}/${buildDir}`);
  core.info(`Deploying fns dir: ${fnsDir ? `${monorepoRoot}/${fnsDir}` : `<none>`}`);
  core.info(`Deploying with message: "${message}"`);
  core.info(`Deploying as draft: ${refIsNotMaster}`);

  try {
    const res = await client.deploy(siteId, `${monorepoRoot}/${buildDir}`, {
      message,
      draft: refIsNotMaster,
      ...(fnsDir ? { fnDir: `${monorepoRoot}/${fnsDir}` } : {}),
      statusCb: (status: any) => status.type !== `hashing` && core.debug(status.msg),
    });

    const url = res.deploy.deploy_ssl_url;
    core.setOutput(`url`, url);
    core.info(`Output \`url\` set to ${url}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
