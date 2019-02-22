// @flow
import { Base64 } from 'js-base64';
import { cloud } from '@friends-library/client';
import type { Context, ModifiedAsciidocFile } from './type';
import kiteCheck from './check/kite';
import lintCheck from './check/lint';

export default async function (context: Context) {
  const { payload: { repository, action, number } } = context;
  if (repository.name === 'friends-library') {
    return Promise.resolve();
  }

  if (['opened', 'synchronize'].includes(action)) {
    getModifiedFiles(context).then(files => {
      kiteCheck(context, files);
      lintCheck(context, files);
    });
  }

  if (action === 'closed') {
    cloud.rimraf(`pull-request/${repository.name}/${number}`);
  }

  return Promise.resolve();
}

async function getModifiedFiles(context: Context): Promise<Array<ModifiedAsciidocFile>> {
  const { github, issue, repo, payload: { pull_request: { head: { sha } } } } = context;
  const { data: modifiedFiles } = await github.pullRequests.listFiles(issue());
  return Promise.all(modifiedFiles.map(mf => {
    return github.repos.getContents(repo({
      path: mf.filename,
      ref: sha,
    })).then(res => ({
      path: mf.filename,
      adoc: Base64.decode(res.data.content),
    }));
  }));
}
