import * as core from '@actions/core';
import { latestCommitSha } from '../helpers';
import * as pr from '../pull-requests';

async function main() {
  const sha = latestCommitSha() || '';
  const shortSha = sha.substr(0, 8);
  if (!sha) {
    core.warning(`Unable to find latest commit sha`);
  }

  const prData = await pr.data();
  const prNum = prData ? prData.number : pr.number() || '';
  const prTitle = prData ? prData.title : '';

  core.setOutput('latest_commit_sha', sha);
  core.setOutput('latest_commit_sha_short', shortSha);
  core.setOutput('pull_request_number', prNum);
  core.setOutput('pull_request_title', prTitle);

  core.info(`Output \`latest_commit_sha\` set to ${sha || '<empty>'}`);
  core.info(`Output \`latest_commit_sha_short\` set to ${shortSha || '<empty>'}`);
  core.info(`Output \`pull_request_number\` set to ${prNum || '<empty>'}`);
  core.info(`Output \`pull_request_title\` set to ${`"${prTitle}"` || '<empty>'}`);
}

main();
