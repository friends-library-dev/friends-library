import { Octokit } from '@octokit/rest';
import env from '@friends-library/env';

export async function openPullRequest(
  repo: string,
  branch: string,
  title: string,
  body = ``,
): Promise<number | false> {
  try {
    const {
      data: { number },
    } = await getClient().request(`POST /repos/:owner/:repo/pulls`, {
      repo,
      title,
      owner: `friends-library`,
      head: branch,
      base: `master`,
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
  const gh = getClient();
  let enRepos = await gh.paginate(`/orgs/friends-library/repos`);
  enRepos = enRepos.filter(repo => repo.name !== `friends-library`);
  const esRepos = await gh.paginate(`/orgs/biblioteca-de-los-amigos/repos`);
  return [...enRepos, ...esRepos];
}

function getClient(): Octokit {
  const { FELL_GITHUB_TOKEN } = env.require(`FELL_GITHUB_TOKEN`);
  return new Octokit({
    auth: `token ${FELL_GITHUB_TOKEN}`,
  });
}
