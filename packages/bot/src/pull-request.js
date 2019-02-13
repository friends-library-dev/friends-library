// @flow
import { Base64 } from 'js-base64';
import type { Context, ModifiedAsciidocFile } from './type';
import kiteCheck from './check/kite';
import lintCheck from './check/lint';

export default async function(context: Context) {
  if (context.payload.repository.name === 'friends-library') {
    return;
  }

  if (['opened', 'synchronize'].includes(context.payload.action)) {
    const files = await getFiles(context);
    return Promise.all([
      kiteCheck(context, files),
      lintCheck(context, files),
    ]);
  }
}

async function getFiles(context: Context): Promise<Array<ModifiedAsciidocFile>> {
  const { github, issue, repo, payload: { pull_request: { head: { sha } } } } = context;
  const { data: modifiedFiles } = await github.pullRequests.listFiles(issue());
  return await Promise.all(modifiedFiles.map(mf => {
    return github.repos.getContents(repo({
      path: mf.filename,
      ref: sha,
    })).then(res => ({
      path: mf.filename,
      adoc: Base64.decode(res.data.content),
    }));
  }));
}
