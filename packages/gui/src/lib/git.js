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

function ensureBranch(task) {
  const { repo, id } = task;
  const taskBranch = `task-${id}`;
  const repoDir = `${PATH_EN}/${repo}`;

  logger.log('repoDir', repoDir);
  logger.log('taskBranch', taskBranch);
  if (getBranch(repoDir) === taskBranch) {
    logger.log('already on it!');
    return taskBranch;
  }

  logger.log('check if status is clean')
  if (!isStatusClean(repoDir)) {
    logger.log('status is not clean');
    cmd('git add . && git commit -m "guibot: WIP auto-commit to switch to task branch"');
  } else {
    logger.log('status is clean! 👍');
  }

  logger.log('check if branch exists');
  if (!branchExists(repoDir, taskBranch)) {
    logger.log('branch does not exist. ¯\_(ツ)_/¯');
    cmd(`git branch "${taskBranch}"`, repoDir);
  }

  logger.log('checkout the branch');
  cmd(`git checkout "${taskBranch}"`, repoDir);

  if (getBranch(repoDir) === taskBranch) {
    logger.log('looks good, checked it out. 👍');
    return taskBranch;
  }

  logger.log('error!');
  throw new Error(`Unable to ensure branch ${taskBranch} for repo ${repoDir}`);
}

function branchExists(repoDir, branch) {
  const branches = cmd('git branch', repoDir).split('\n').map(b => b.trim());
  return branches.includes(branch);
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
  if (!repoDir) {
    throw new Error(`Repodir required for command: ${command}`);
  }

  if (log || 1) {
    logger.log(`${repoDir}: ${command}`);
  }

  let result;
  try {
    result = execSync(`cd ${repoDir} && ${command}`, { stdio: 'ignore' }).toString();
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
  return result;
}

module.exports = {
  updateRepo,
  ensureBranch,
}
