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
  console.log(JSON.stringify(comments, null, 2));
}
