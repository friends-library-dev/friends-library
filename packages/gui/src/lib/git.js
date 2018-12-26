const path = require('path');
const logger = require('electron-timber');
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { PATH_EN } = require('./path');

function updateRepo(repo) {
  const repoDir = `${PATH_EN}/${repo.name}`;
  if (!existsSync(repoDir)) {
    cmd(`git clone ${repo.ssh_url}`, path.dirname(repoDir));
  }
  if (isStatusClean(repoDir) && getBranch(repoDir) === 'master') {
    cmd('git pull --rebase origin master', repoDir, true);
  }
}

function isStatusClean(repoDir) {
  return getStatus(repoDir) === '';
}

function getStatus(repoDir) {
  return cmd('git status --porcelain', repoDir).trim();
}

function getBranch(repoDir) {
  return cmd('git rev-parse --abbrev-ref HEAD', repoDir).trim();
}

function cmd(command, repoDir, log) {
  if (log) {
    logger.log(`${repoDir}: ${command}`);
  }
  return execSync(`cd ${repoDir} && ${command}`, { stdio: 'ignore' }).toString();
}

module.exports = {
  updateRepo,
}
