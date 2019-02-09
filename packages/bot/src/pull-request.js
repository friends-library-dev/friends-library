// @flow
import { Base64 } from 'js-base64';
import lintAdoc from './lint-adoc';
import type { Context } from './app';

export default async function(context: Context) {
  const { payload, github: gh } = context;
  const sha = payload.pull_request.head.sha;
  if (payload.repository.name === 'friends-library') {
    return;
  }

  await gh.checks.create(context.repo({
    name: 'fl-bot/kite',
    head_sha: sha,
    status: 'queued',
    started_at: new Date(),
  }));

  const { data: { id: lintCheckId } } = await gh.checks.create(context.repo({
    name: 'fl-bot/lint-asciidoc',
    head_sha: sha,
    status: 'in_progress',
    started_at: new Date(),
  }));

  console.log({ lintCheckId  });

  const { data: modifiedFiles } = await gh.pullRequests.listFiles(context.repo({
    number: payload.pull_request.number,
  }));

  const adocFiles = await Promise.all(modifiedFiles.map(mf => {
    return gh.repos.getContents(context.repo({
      path: mf.filename,
      ref: sha,
    })).then(res => ({
      path: mf.filename,
      adoc: Base64.decode(res.data.content),
    }));
  }));

  const annotations = lintAdoc(adocFiles);
  // console.log(annotations);
  await gh.checks.update(context.repo({
    check_run_id: lintCheckId,
    status: 'completed',
    conclusion: 'failure',
    completed_at: new Date(),
    output: {
      title: 'Terrible work, son!',
      summary: 'I expected better from you :(',
      annotations,
    }
  }));
}
