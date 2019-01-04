const path = require('path');
const { ipcRenderer } = require('electron');
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const logger = require('./log');
const { PATH_EN } = require('./path');

function updateRepo(repo) {
  const repoDir = `${PATH_EN}/${repo.name}`;
  if (!existsSync(repoDir)) {
    cmd(`git clone ${repo.ssh_url}`, path.dirname(repoDir));
  }
  if (isStatusClean(repoDir) && getBranch(repoDir) === 'master') {
    cmd('git pull --rebase origin master', repoDir);
  }
}

function ensureBranch(task) {
  const { repo, id } = task;
  const taskBranch = `task-${id}`;
  const repoDir = `${PATH_EN}/${repo}`;

  if (getBranch(repoDir) === taskBranch) {
    return taskBranch;
  }

  if (!isStatusClean(repoDir)) {
    commit('guibot: WIP auto-commit to switch to task branch', repoDir);
  }

  if (!branchExists(repoDir, taskBranch)) {
    if (getBranch(repoDir) !== 'master') {
      cmd('git checkout master', repoDir);
    }
    cmd('git pull --rebase origin master', repoDir);
    cmd(`git branch "${taskBranch}"`, repoDir);
  }

  cmd(`git checkout "${taskBranch}"`, repoDir);

  logger.log('------');
  logger.log(getBranch(repoDir));
  logger.log(taskBranch);
  logger.log(getBranch(repoDir) === taskBranch);
  if (getBranch(repoDir) === taskBranch) {
    return taskBranch;
  }

  notifyAndThrow(`Unable to ensure branch ${taskBranch} for repo ${repoDir}`);
}

function commitWip(repo) {
  const repoDir = `${PATH_EN}/${repo}`;
  if (isStatusClean(repoDir)) {
    return;
  }
  commit(`guibot: WIP saved at ${new Date().toString()}`, repoDir);
}

function commit(msg, repoDir) {
  return cmd(`git add . && git commit -m "${msg}"`, repoDir);
}

function pushTask(task) {
  const repoDir = `${PATH_EN}/${task.repo}`;
  ensureBranch(task);
  return cmd(`git push origin task-${task.id}`, repoDir);
}

function notifyAndThrow(err) {
  ipcRenderer.send('error', err);
  throw new Error(err);
}

function branchExists(repoDir, branch) {
  const branches = cmd('git branch', repoDir)
    .split('\n')
    .map(b => b.trim().replace(/^\* /, ''));
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
    notifyAndThrow(`No repoDir passed for command ${command}`);
    return '';
  }

  if (log || 1) {
    logger.log(`${repoDir}: ${command}`);
  }

  const output = execSync(`${command}`, { lol_stdio: 'ignore', cwd: repoDir });
  return output && typeof output.toString === 'function' ? output.toString() : '';
}

module.exports = {
  pushTask,
  updateRepo,
  ensureBranch,
  commitWip,
}
