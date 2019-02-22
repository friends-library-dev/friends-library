// @flow
import { Base64 } from 'js-base64';
import stripIndent from 'strip-indent';
import { cloud } from '@friends-library/client';
import type { Context, ModifiedAsciidocFile } from './type';
import kiteCheck from './check/kite';
import lintCheck from './check/lint';

export default function (context: Context) {
  const { payload: { repository, action, number }, github, issue } = context;
  if (repository.name === 'friends-library') {
    if (action === 'opened') {
      const body = getNetlifyPreviewComment(number);
      github.issues.createComment(issue({ body }));
    }
    return;
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

function getNetlifyPreviewComment(prNumber: number): string {
  return stripIndent(`
    Deploy previews:

    - [Website (English)](https://deploy-preview-${prNumber}--en-evans.netlify.com)
    - [Website (Spanish)](https://deploy-preview-${prNumber}--es-evans.netlify.com)
    - [Online Editor](https://deploy-preview-${prNumber}--flp-editor.netlify.com)
    - [Styleguide](https://deploy-preview-${prNumber}--flp-styleguide.netlify.com)
  `).trim();
}
