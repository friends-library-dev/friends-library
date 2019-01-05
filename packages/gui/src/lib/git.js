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

  if (getBranch(repoDir) === taskBranch) {
    return taskBranch;
  }

  return notifyAndThrow(`Unable to ensure branch ${taskBranch} for repo ${repoDir}`);
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

function deleteTaskBranch(task) {
  const repoDir = `${PATH_EN}/${task.repo}`;
  const branch = `task-${task.id}`;

  if (!branchExists(repoDir, branch)) {
    return;
  }

  if (getBranch(repoDir) === branch) {
    cmd('git reset --hard HEAD', repoDir);
    cmd('git checkout master', repoDir);
  }

  cmd(`git branch -D ${branch}`, repoDir);
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


const log = true;

function cmd(command, repoDir) {
  if (!repoDir) {
    notifyAndThrow(`No repoDir passed for command ${command}`);
    return '';
  }

  if (log) {
    logger.log(`${repoDir}: ${command}`);
  }

  const output = execSync(`${command}`, {
    cwd: repoDir,
    ...log ? {} : { stdio: 'ignore' },
  });

  return output && typeof output.toString === 'function' ? output.toString() : '';
}

module.exports = {
  pushTask,
  updateRepo,
  ensureBranch,
  commitWip,
  deleteTaskBranch,
};
