// @flow
/* istanbul ignore file */
import { Base64 } from 'js-base64';
import Octokit from '@octokit/rest';
import get from 'lodash/get';
import type { Slug, Sha, FilePath, Asciidoc, Css, Url } from '../../../../type';

const { env: { GITHUB_API_TOKEN, NODE_ENV } } = process;

const gh = new Octokit({
  auth: `token ${GITHUB_API_TOKEN || ''}`
});

const owner = `friends-library${NODE_ENV === 'production' ? '' : '-sandbox'}`;

export async function getModifiedFiles(
  repo: Slug,
  prNumber: number,
): Promise<Array<string>> {
  return await gh.request(
    '/repos/:owner/:repo/pulls/:number/files',
    { repo, owner, number: prNumber },
  ).then(res => res.data.map(file => file.filename));
}

export async function getPrFiles(
  repo: Slug,
  sha: Sha,
): Promise<Map<FilePath, Asciidoc | Css>> {
  const treeUrl = await gh.request(
    '/repos/:owner/:repo/commits/:sha',
    { repo, sha, owner },
  ).then(res => res.data.commit.tree.url);

  const { data: { tree } } = await gh.request(`${treeUrl}?recursive=true`);
  const blobs = tree.filter(node => node.type === 'blob');

  const map = new Map();
  const promises = blobs.map(file => {
    return gh.request(file.url)
      .then(json => {
        map.set(file.path, Base64.decode(json.data.content));
      });
  });

  await Promise.all(promises);
  return map;
}

export async function updateableComment(
  repo: Slug,
  number: number,
  body: string,
  search: string,
): Promise<void> {
  const endpoint = '/repos/:owner/:repo/issues/:number/comments';
  const { data: comments } = await gh.request(endpoint, {
    repo,
    owner,
    number,
  });

  const prevComment = comments.find(c => c.body.includes(search));
  if (!prevComment) {
    return await gh.request(`POST ${endpoint}`, {
      repo,
      owner,
      number,
      body,
    });
  }

  return await gh.request('PATCH /repos/:owner/:repo/issues/comments/:id', {
    repo,
    owner,
    id: prevComment.id,
    body,
  });
}
