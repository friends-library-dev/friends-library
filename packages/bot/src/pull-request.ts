import { Base64 } from 'js-base64';
import { Context } from 'probot';
import stripIndent from 'strip-indent';
import { cloud } from '@friends-library/client';
import { ModifiedAsciidocFile } from './type';
import kiteCheck from './check/kite';
import lintCheck from './check/lint';

export default async function(context: Context): Promise<void> {
  const {
    payload: { repository, action, number },
    github,
    issue,
  } = context;
  if (repository.name === 'friends-library') {
    if (action === 'opened') {
      const body = getNetlifyPreviewComment(number);
      github.issues.createComment(issue({ body }));
    }
    return;
  }

  if (['opened', 'synchronize', 'reopened'].includes(action)) {
    getModifiedFiles(context).then(files => {
      context.log.info(
        'Received modified files, passing on to `lintCheck` and `kiteCheck`',
      );
      context.log.debug({ files }, 'modified files');
      lintCheck(context, files);
      kiteCheck(context, files);
    });
  }

  if (action === 'closed') {
    cloud.rimraf(`pull-request/${repository.name}/${number}`);
  }
}

async function getModifiedFiles(context: Context): Promise<ModifiedAsciidocFile[]> {
  const {
    github,
    issue,
    repo,
    payload: {
      pull_request: {
        head: { sha },
      },
    },
  } = context;
  const { data: modifiedFiles } = await github.pullRequests.listFiles(
    issue({
      per_page: 100,
    }),
  );
  return Promise.all(
    modifiedFiles.map(mf => {
      return github.repos
        .getContents(
          repo({
            path: mf.filename,
            ref: sha,
          }),
        )
        .then(res => ({
          path: mf.filename,
          adoc: Base64.decode(res.data.content),
        }));
    }),
  );
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
