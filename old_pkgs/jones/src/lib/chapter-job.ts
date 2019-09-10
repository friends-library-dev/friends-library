import { Uuid, Job } from '@friends-library/types';
import { createJob, createPrecursor, createSourceSpec } from '@friends-library/asciidoc';
import { State } from '../type';

export default function chapterJob(state: State, taskId: Uuid, path: string): Job {
  const task = state.tasks.present[taskId];
  if (!task) throw new Error(`Task ${taskId} not found`);
  const file = task.files[path];
  if (!file) throw new Error(`No file with path ${path}`);
  const adoc = file.editedContent == null ? file.content : file.editedContent;
  const precursor = createPrecursor({ adoc });
  const spec = createSourceSpec(precursor);
  return createJob({ spec });
}
