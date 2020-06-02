import { Octokit } from '@octokit/action';

const client = new Octokit();

export async function deleteBotCommentsContaining(
  str: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<void> {
  const { data: comments } = await client.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
  });
  comments.forEach(comment => {
    if (comment.user.type === 'Bot' && comment.body.includes(str)) {
      client.issues.deleteComment({ owner, repo, comment_id: comment.id });
    }
  });
}
