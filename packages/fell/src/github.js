// @flow
import Octokit from '@octokit/rest';

const { env: { GITHUB_API_TOKEN } } = process;

const gh = new Octokit({
  auth: `token ${GITHUB_API_TOKEN || ''}`,
});

export async function openPullRequest(
  repo: string,
  branch: string,
  title: string,
  body: string = '',
): Promise<number | false> {
  try {
    const { data: { number } } = await gh.request('POST /repos/:owner/:repo/pulls', {
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

export async function getFriendRepos(): Promise<Array<Object>> {
  const repos = await gh.paginate('/orgs/friends-library/repos');
  return repos.filter(repo => repo.name !== 'friends-library');
}
