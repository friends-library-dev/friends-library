const { execSync } = require('child_process');
const { PATH_EN } = require('./path');

function updateRepo(repoDir) {
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
    console.log(`${repoDir}: ${command}`);
  }
  return execSync(`cd ${repoDir} && ${command}`, { stdio: 'ignore' }).toString();
}

module.exports = {
  updateRepo,
}
