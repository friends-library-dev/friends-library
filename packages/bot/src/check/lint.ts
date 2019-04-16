import chunk from 'lodash/chunk';
import { Context } from 'probot';
import { ModifiedAsciidocFile } from '../type';
import { getLintAnnotations } from '../lint-adoc';

export default async function lintCheck(
  context: Context,
  files: Array<ModifiedAsciidocFile>,
): Promise<void> {
  const { payload, github, repo } = context;
  const {
    data: { id },
  } = await github.checks.create(
    repo({
      name: 'lint-asciidoc',
      head_sha: payload.pull_request.head.sha,
      status: 'in_progress',
      started_at: new Date().toString(),
    }),
  );

  const annotations = getLintAnnotations(files);
  context.log.info(`Generated ${annotations.length} annotations`);
  context.log.debug({ annotations }, 'annotations');

  const update = {
    check_run_id: id,
    status: 'completed',
    completed_at: new Date().toString(),
  } as const;

  if (annotations.length === 0) {
    github.checks.update(
      repo({
        ...update,
        conclusion: 'success',
      }),
    );
    return;
  }

  // github limits to max 50 annotations per request
  const pages = chunk(annotations, 50);

  pages.forEach(async page => {
    await github.checks.update(
      repo({
        ...update,
        conclusion: 'failure',
        output: {
          title: 'Asciidoc lint failure',
          summary: `Found ${annotations.length} problems`,
          annotations: page,
        },
      }),
    );
  });
}
