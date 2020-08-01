import { isNotFalse } from '@friends-library/types';
import path from 'path';
import glob from 'glob';
import { Repo } from './type';
import * as git from './git';

export async function getRepos(exclude: string[], branch?: string): Promise<string[]> {
  const cwd = process.cwd();
  const enRepos = glob.sync(path.resolve(cwd, `en`, `*`));
  const esRepos = glob.sync(path.resolve(cwd, `es`, `*`));
  const repos = [...enRepos, ...esRepos];
  const notExcluded = repos.filter((repo) => {
    return exclude.reduce((bool, str) => {
      return bool === false ? false : repo.indexOf(str) === -1;
    }, true as boolean);
  });

  if (!branch) {
    return notExcluded;
  }

  const branches = await Promise.all(
    notExcluded.map(async (repo) => git.getCurrentBranch(repo)),
  );

  return branches
    .map((repoBranch, index) => {
      return repoBranch === branch ? notExcluded[index] : false;
    })
    .filter(isNotFalse);
}

export async function getStatusGroups(
  repos: Repo[],
): Promise<{ clean: Repo[]; dirty: Repo[] }> {
  const clean: Repo[] = [];
  const dirty: Repo[] = [];
  await Promise.all(
    repos.map(async (repo) => {
      const isClean = await git.isStatusClean(repo);
      if (isClean) {
        clean.push(repo);
      } else {
        dirty.push(repo);
      }
    }),
  );
  return { dirty, clean };
}

export async function getBranchMap(repos: Repo[]): Promise<Map<string, Repo[]>> {
  const repoBranches = new Map();
  await Promise.all(
    repos.map(async (repo) => {
      const branch = await git.getCurrentBranch(repo);
      repoBranches.set(repo, branch);
    }),
  );
  return [...repoBranches.entries()].reduce((map, [repo, branch]) => {
    const current = map.get(branch);
    map.set(branch, current ? current.concat([repo]) : [repo]);
    return map;
  }, new Map());
}
