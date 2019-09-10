import Octokit from '@octokit/rest';

const {
  env: { FELL_GITHUB_TOKEN },
} = process;

if (typeof FELL_GITHUB_TOKEN !== 'string') {
  throw new Error('Env var FELL_GITHUB_TOKEN required.');
}

const gh = new Octokit({
  auth: `token ${FELL_GITHUB_TOKEN}`,
});

export async function openPullRequest(
  repo: string,
  branch: string,
  title: string,
  body: string = '',
): Promise<number | false> {
  try {
    const {
      data: { number },
    } = await gh.request('POST /repos/:owner/:repo/pulls', {
      repo,
      title,
      owner: 'friends-library',
      head: branch,
      base: 'master',
      body,
      maintainer_can_modify: true,
    });
    return number;
  } catch (e) {
    return false;
  }
}

export async function getFriendRepos(): Promise<
  { name: string; ssh_url: string; clone_url: string; full_name: string }[]
> {
  let enRepos = await gh.paginate('/orgs/friends-library/repos');
  enRepos = enRepos.filter(repo => repo.name !== 'friends-library');
  const esRepos = await gh.paginate('/orgs/biblioteca-de-los-amigos/repos');
  return [...enRepos, ...esRepos];
}
