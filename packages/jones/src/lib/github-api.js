// @flow
import Octokit from '@octokit/rest';
import { Base64 } from 'js-base64';
import type { Slug } from '../../../../type';
import type { Task, File } from '../type';
import { values } from '../flow-utils';

const isDev = process.env.NODE_ENV === 'development';

let GITHUB_ORG = 'friends-library';
if (process.env.GITHUB_ORG) {
  GITHUB_ORG = process.env.GITHUB_ORG;
} else if (process.env.REACT_APP_NETLIFY_CONTEXT === 'deploy-preview' || isDev) {
  GITHUB_ORG = 'friends-library-sandbox';
}
export const ORG = GITHUB_ORG;

type Sha = string;
type RepoSlug = string;
type BranchName = string;
type GitFile = {|
  path: string,
  sha: Sha,
  content: string,
|};

let gh = new Octokit();

export function authenticate(token: string): void {
  gh = new Octokit({
    auth: `token ${token}`,
  });
}

export async function getFriendRepos(): Promise<Array<Object>> {
  const repos = await gh.paginate(`/orgs/${ORG}/repos`);
  return repos.filter(repo => repo.name !== ORG);
}

export async function getRepoSlug(repoId: number): Promise<Slug> {
  const { data: { name: slug } } = await req('/repositories/:id', { id: repoId });
  return slug;
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

export async function getAdocFiles(
  repo: RepoSlug,
  sha: Sha,
): Promise<Array<GitFile>> {
  const tree = await getTree(repo, sha);
  const filePromises = tree.filter(isAsciidoc).map(async blob => {
    const { data: { content } } = await req('/repos/:owner/:repo/git/blobs/:sha', {
      repo,
      sha: blob.sha,
    });
    return {
      path: blob.path,
      sha: blob.sha,
      content: Base64.decode(content),
    }
  });

  return await Promise.all(filePromises);
}

export async function getTree(
  repo: RepoSlug,
  sha: Sha,
): Promise<Array<*>> {
  const { data: { tree } } = await req('/repos/:owner/:repo/git/trees/:sha?recursive=1', {
    repo,
    sha,
  });
  return tree;
}

async function createFork(repo: RepoSlug, user: string): Promise<void> {
  await req('POST /repos/:owner/:repo/forks', {
    repo,
  });
  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const forkExists = await hasFork(repo, user);
      if (forkExists) {
        clearInterval(interval);
        resolve();
      }
    }, 250);
  });
}

async function hasFork(repo: RepoSlug, user: string): Promise<boolean> {
  try {
    await req('/repos/:owner/:repo', {
      owner: user,
      repo,
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function syncFork(repo: RepoSlug, user: string): Promise<void> {
  const upstream = await req('/repos/:owner/:repo/git/refs/heads/master', {
    repo,
  });

  await req('PATCH /repos/:owner/:repo/git/refs/heads/master', {
    sha: upstream.data.object.sha,
    owner: user,
    repo,
  });
}

async function ensureSyncedFork(repo: RepoSlug, user: string): Promise<void> {
  const forkExists = await hasFork(repo, user);
  if (!forkExists) {
    await createFork(repo, user);
  }
  await syncFork(repo, user);
}

export async function addCommit(task: Task, user: string): Promise<Sha> {
  const { parentCommit = '', repoId, id, files } = task;
  const branchName = `task-${id}`;
  const repo = await getRepoSlug(repoId);
  const baseTreeSha = await getTreeSha(repo, parentCommit, user);
  const newTreeSha = await createTree(repo, baseTreeSha, files, user);
  const msg = `updates to task: ${task.name}`;
  const newCommitSha = await createCommit(repo, newTreeSha, parentCommit, msg, user);
  await updateHead(repo, branchName, newCommitSha, user);
  return newCommitSha;
}

export async function createNewPullRequest(
  task: Task,
  user: string,
): Promise<{ number: number, commit: Sha }> {
  const { parentCommit = '', repoId, id, files } = task;
  const branchName = `task-${id}`;
  const repo = await getRepoSlug(repoId);
  await ensureSyncedFork(repo, user);
  await createBranch(repo, branchName, parentCommit, user);
  const baseTreeSha = await getTreeSha(repo, parentCommit, user);
  const newTreeSha = await createTree(repo, baseTreeSha, files, user);
  const newCommitSha = await createCommit(repo, newTreeSha, parentCommit, task.name, user);
  await updateHead(repo, branchName, newCommitSha, user);
  const prNumber = await openPullRequest(repo, branchName, task.name, user);
  return {
    commit: newCommitSha,
    number: prNumber,
  }
}

async function openPullRequest(
  repo: RepoSlug,
  branch: BranchName,
  title: string,
  user: string,
): Promise<number> {
  const body = getPrBody(user);
  const { data: { number } } = await req('POST /repos/:owner/:repo/pulls', {
    repo,
    title,
    owner: ORG,
    head: `${user}:${branch}`,
    base: 'master',
    body,
    maintainer_can_modify: true,
  });
  return number;
}

function getPrBody(user: string): string {
  if (isDev || ORG !== 'friends-library' || user === 'jaredh159') {
    return '';
  }
  if (user === 'Henderjay') {
    return '@jaredh159';
  }
  return '@jaredh159 @Henderjay';
}

async function updateHead(
  repo: RepoSlug,
  branch: BranchName,
  sha: Sha,
  owner: string = ORG,
): Promise<void> {
  await req('PATCH /repos/:owner/:repo/git/refs/heads/:branch', {
    repo,
    owner,
    branch,
    sha,
  });
}

async function createCommit(
  repo: RepoSlug,
  treeSha: Sha,
  parent: Sha,
  message: string,
  owner: string = ORG,
): Promise<Sha> {
  const { data: { sha } } = await req('POST /repos/:owner/:repo/git/commits', {
    owner,
    repo,
    message,
    tree: treeSha,
    parents: [parent],
  });
  return sha;
}

async function createTree(
  repo: RepoSlug,
  baseTreeSha: Sha,
  files: { [string]: File },
  owner: string = ORG,
): Promise<Sha> {
  const { data: { sha } } = await req('POST /repos/:owner/:repo/git/trees', {
      repo,
      owner,
      base_tree: baseTreeSha,
      tree: values(files).filter(validContent).map(f => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.editedContent,
      })),
    });
    return sha;
}

function validContent(file: File): boolean {
  if (!file.editedContent) {
    return false;
  }
  if (file.editedContent === 'null') {
    return false;
  }
  return true;
}

export async function createBranch(
  repo: RepoSlug,
  newBranchName: BranchName,
  parentCommit: Sha,
  owner: string = ORG,
): Promise<{| branch: BranchName, sha: Sha |}> {
  const res = await gh.git.createRef({
    owner,
    repo,
    sha: parentCommit,
    ref: `refs/heads/${newBranchName}`,
  });
  if (res.status === 201) {
    return res.data.object.sha;
  }
  throw new Error(`Failed to create branch ¯\\_(ツ)_/¯`);
}

export async function getTreeSha(
  repo: RepoSlug,
  sha: Sha,
  owner: string = ORG
): Promise<Sha> {
  const res = await req('/repos/:owner/:repo/git/commits/:sha', {
    owner,
    repo,
    sha,
  });
  return res.data.tree.sha;
}

export async function req(route: string, opts: Object = {}): Promise<*> {
  if (route.match(/:owner/) && !opts.owner) {
    opts = { ...opts, owner: ORG };
  }
  return gh.request(route, opts);
}

function isAsciidoc(node): boolean {
  return node.type === 'blob' && node.path.match(/\.adoc$/);
}
