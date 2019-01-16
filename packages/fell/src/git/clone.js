// @flow
import { green, magenta } from '@friends-library/cli/color';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import { flatten } from 'lodash';
import { cmd } from '.';

export async function getFriendRepos(): Promise<Array<Object>> {
  const promises = [];
  const numPages = await getNumRepoPages();
  for (let i = 1; i <= numPages; i++) {
    promises.push(getPageRepos(i));
  }
  return Promise.all(promises).then(flatten);
}

function getPageRepos(page: number): Promise<Array<Object>> {
  return getReposPage(page)
    .then(res => res.json())
    .then(repos => repos.filter(repo => repo.name !== 'friends-library'));
}

function getNumRepoPages(): Promise<number> {
  return getReposPage(1)
    .then(res => {
      const link = res.headers.get('link');
      if (!link) {
        return 1;
      }
      return Number(link.replace(/.+page=/, '').replace(/[^\d]+/, ''));
    });
}

function getReposPage(page: number): Promise<*> {
  // unscoped token, no privileges, read-only to public info, so ¯\_(ツ)_/¯
  const token = '?access_token=bc14d218db2e8a03d5c209c159bc29d7cf02e8c3';
  return fetch(`https://api.github.com/orgs/friends-library/repos${token}&page=${page}`, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
}

export async function gitClone(): Promise<void> {
  let alreadyCloned = 0;
  const cwd = process.cwd();
  const repos = await getFriendRepos();
  repos.forEach(repo => {
    const slug = repo.name;
    if (!fs.pathExistsSync(`${cwd}/en/${slug}`)) {
      green(`📡  Cloning missing repo "/en/${slug}"`);
      cmd(`git clone ${repo.ssh_url}`, `${cwd}/en`);
    } else {
      alreadyCloned++;
    }
  });
  magenta(`👌  Skipped ${alreadyCloned} repos already cloned.`);
}
