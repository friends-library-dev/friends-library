import { Octokit as pr } from '@octokit/action';
import * as core from '@actions/core';
import { getEventJson, latestCommitSha } from './helpers';

/**
 * Get pull request data.
 *
 * Works for `pull_request.*` events, and also gives
 * correct result for a `push` event created by merging a PR
 */
export async function data(): Promise<{ number: number; title: string } | void> {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || ``).split(`/`);
  const client = new pr();
  const prNum = numberFromEnv();

  if (prNum) {
    const { data: pr } = await client.pulls.get({ owner, repo, pull_number: prNum });
    if (pr) {
      return pr;
    }
  }

  const { data: prs } = await client.repos.listPullRequestsAssociatedWithCommit({
    owner,
    repo,
    commit_sha: latestCommitSha() || ``,
  });
  if (prs.length) {
    return prs[0];
  }
}

export async function number(): Promise<number | void> {
  const fromEnv = numberFromEnv();
  if (fromEnv) {
    return fromEnv;
  }

  const prData = await data();
  if (prData) {
    return prData.number;
  }
}

function numberFromEnv(): number | void {
  const { GITHUB_REF = `` } = process.env;
  const refMatch = /refs\/pull\/(\d+)\/merge/g.exec(GITHUB_REF);
  if (refMatch) {
    return Number(refMatch[1]);
  }

  const event = getEventJson();
  if (event?.pull_request?.number) {
    return Number(event.pull_request.number);
  }
}

export async function deleteBotCommentsContaining(str: string): Promise<void> {
  const client = new pr();
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || ``).split(`/`);
  const prNumber = await number();
  if (!prNumber) {
    core.warning(`Unable to find PR number, skipping attempt to delete PR bot comments`);
    return;
  }

  const { data: comments } = await client.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
  });

  comments.forEach(comment => {
    if (comment.user.type === `Bot` && comment.body.includes(str)) {
      client.issues.deleteComment({ owner, repo, comment_id: comment.id });
    }
  });
}
