import { Uuid, Html, AsciidocConversionLog } from '@friends-library/types';
import { processDocument } from '@friends-library/adoc-convert';
import { webHtml } from '@friends-library/doc-html';
import { State } from '../type';

export default function chapterHtml(
  state: State,
  taskId: Uuid,
  path: string,
): [Html, AsciidocConversionLog[]] {
  const task = state.tasks.present[taskId];
  if (!task) throw new Error(`Task ${taskId} not found`);
  const file = task.files[path];
  if (!file) throw new Error(`No file with path ${path}`);
  const adoc = file.editedContent == null ? file.content : file.editedContent;
  const { sections, logs } = processDocument(adoc);
  const html = webHtml(sections);
  return [html, logs];
}
