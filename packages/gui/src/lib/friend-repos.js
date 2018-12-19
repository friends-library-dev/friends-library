// @flow
import fetch from 'node-fetch';
import { flatten } from 'lodash';

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
  return fetch(`https://api.github.com/orgs/friends-library/repos?page=${page}`, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
}
