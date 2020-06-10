import * as core from '@actions/core';
import * as cloud from '@friends-library/cloud';
import * as pr from '../pull-requests';

async function main() {
  const [, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const prNumber = await pr.number();
  const path = `actions/${repo}/${prNumber}`;
  await cloud.rimraf(path);
  core.info(`Deleted uploaded pdfs at \`${path}\``);
}

main();
