// @flow
// $FlowFixMe
import Octokit from '@octokit/rest';
// $FlowFixMe
import uuid from 'uuid/v4';


type Sha = string;
type RepoSlug = string;
type BranchName = string;
type GitFile = {|
  path: string,
  sha: Sha,
  content: string,
|};

const gh = new Octokit();

export function authenticate(token: string): void {
  gh.authenticate({
    type: 'oauth',
    token,
  });
}

export async function getHeadSha(
  repo: RepoSlug,
  branch: BranchName = 'master',
): Promise<Sha> {
  const response = await req('/repos/:owner/:repo/git/refs/heads/:branch', {
    repo,
    branch,
  });
  const { data: { object: { sha } } } = response;
  return sha;
}

export async function getAdocFiles(repo: RepoSlug): Promise<Array<GitFile>> {
  const headSHA = await getHeadSha(repo);

  const { data: { tree } } = await req('/repos/:owner/:repo/git/trees/:sha?recursive=1', {
    repo,
    sha: headSHA,
  });

  const filePromises = tree.filter(isAsciidoc).map(async blob => {
    const { data: { content } } = await req('/repos/:owner/:repo/git/blobs/:sha', {
      repo,
      sha: blob.sha,
    });
    return {
      path: blob.path,
      sha: blob.sha,
      content: window.atob(content),
    }
  });

  return await Promise.all(filePromises);
}


export async function createBranch(
  repo: RepoSlug,
  parentBranch: BranchName = 'master',
): Promise<{| branch: BranchName, sha: Sha |}> {
  const sha = await getHeadSha(repo, parentBranch);
  const branch = `task-${uuid()}`;
  const res = await req('POST /repos/:owner/:repo/git/refs', {
    repo,
    sha,
    ref: `refs/heads/${branch}`,
  });
  if (res.status === 201) {
    return {
      branch,
      sha: res.data.object.sha,
    }
  }
  throw new Error(`Failed to create branch ¯\\_(ツ)_/¯`);
}

export async function getTreeSha(
  repo: RepoSlug,
  branch: BranchName = 'master',
): Promise<Sha> {
  const sha = await getHeadSha(repo);
  const res = await req('/repos/:owner/:repo/git/commits/:sha', {
    repo,
    sha,
  });
  return res.data.tree.sha;
}


export async function req(route: string, opts: Object = {}): Promise<*> {
  if (route.match(/:owner/) && !opts.owner) {
    opts = { ...opts, owner: 'friends-library' };
  }
  return gh.request(route, opts);
}

function isAsciidoc(node): boolean {
  return node.type === 'blob' && node.path.match(/\.adoc$/);
}
