// @flow
import { Base64 } from 'js-base64';
import type { Asciidoc, FilePath } from '../../../../type';
import type { Context } from '../app';
import getLintAnnotations from '../lint-adoc';

export default async function lintCheck(context: Context): Promise<void> {
  const { payload, github, repo, issue } = context;
  const { data: { id } } = await github.checks.create(repo({
    name: 'fl-bot/lint-asciidoc',
    head_sha: payload.pull_request.head.sha,
    status: 'in_progress',
    started_at: new Date(),
  }));

  const files = await getFiles(context);
  const annotations = getLintAnnotations(files);

  const update = {
    check_run_id: id,
    status: 'completed',
    completed_at: new Date(),
  };

  if (annotations.length === 0) {
    await github.checks.update(repo({
      ...update,
      conclusion: 'success',
    }));
    return;
  }

  await github.checks.update(repo({
    ...update,
    conclusion: 'failure',
    output: {
      title: 'Asciidoc lint failure',
      summary: `Found ${annotations.length} problems`,
      annotations,
    }
  }))
}

type File = {|
  path: FilePath,
  adoc: Asciidoc,
|};

async function getFiles(context: Context): Promise<Array<File>> {
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
