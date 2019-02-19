// @flow
import type { ModifiedAsciidocFile, Context } from '../type';
import getLintAnnotations from '../lint-adoc';

export default async function lintCheck(
  context: Context,
  files: Array<ModifiedAsciidocFile>,
): Promise<void> {
  const { payload, github, repo } = context;
  const { data: { id } } = await github.checks.create(repo({
    name: 'fl-bot/lint-asciidoc',
    head_sha: payload.pull_request.head.sha,
    status: 'in_progress',
    started_at: new Date(),
  }));

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
    },
  }));
}
