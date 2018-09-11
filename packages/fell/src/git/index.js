// @flow
import { resolve as pathResolve } from 'path';
import { execSync } from 'child_process';
import glob from 'glob';
import chalk from 'chalk';
import { red, green, log } from '@friends-library/color';

type Argv = {|
  exclude?: string,
  message?: string,
  push?: boolean,
|};

export function gitStatus(argv: Argv): void {
  const { dirty } = getRepoStatuses(argv);
  if (dirty.length === 0) {
    green('🛁  No uncommitted changes in any document repos.');
  }

  red(`🚽  Uncommitted changes found in ${dirty.length} repos:`);
  dirty.forEach(repo => {
    console.log(`   ${chalk.grey('↳')} ${chalk.yellow(rel(repo))}`);
  });
}

export function gitDiff(argv: Argv): void {
  getRepos(argv).forEach(repo => cmd('git difftool', repo));
}

export function gitCommit(argv: Argv): void {
  const { dirty } = getRepoStatuses(argv);
  if (!argv.message) {
    red('Message is required for `fell git commit`');
    process.exit(1);
  }

  dirty.forEach(repo => {
    cmd('git add .', repo);
    cmd(`git commit -m "${argv.message || ''}"`, repo);
    if (argv.push) {
      cmd('git push origin master', repo);
    }
  });

  log(`committed changes to ${dirty.length} repos`);
}

export function gitBranch(argv: Argv): void {
  const branches = getRepoBranches(argv);
  Array.from(branches).forEach(([branch, repos]) => {
    log(`${repos.length} repos on branch ${chalk.green(`<${branch}>`)}`);
    repos.forEach(repo => {
      log(`  ${chalk.grey('↳')} ${chalk.yellow(rel(repo))}`);
    });
  });
}

function rel(path: string): string {
  return path.replace(`${process.cwd()}/`, '');
}

function getRepoBranches(argv: Argv): Map<string, Array<string>> {
  return getRepos(argv).reduce((map, repo) => {
    const branch = getBranch(repo);
    const current = map.get(branch);
    map.set(branch, current ? current.concat([repo]) : [repo]);
    return map;
  }, new Map());
}

function getRepoStatuses(argv: Argv): {| clean: Array<string>, dirty: Array<string> |} {
  const clean = [];
  const dirty = [];
  getRepos(argv).forEach(repo => (getStatus(repo) ? dirty.push(repo) : clean.push(repo)));
  return { clean, dirty };
}


function getRepos(argv: Argv): Array<string> {
  let repos = glob.sync(pathResolve(process.cwd(), 'en', '*'))
    .concat(glob.sync(pathResolve(process.cwd(), 'es', '*')));

  if (argv.exclude) {
    repos = repos.filter(repoPath => repoPath.indexOf(argv.exclude) === -1);
  }

  return repos;
}

function getStatus(repo): string {
  return cmd('git status --porcelain', repo);
}

function getBranch(repo): string {
  return cmd('git rev-parse --abbrev-ref HEAD', repo).trim();
}

function cmd(command: string, repo: string): string {
  return execSync(`cd ${repo} && ${command}`).toString();
}
