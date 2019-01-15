// @flow
import { State, Task } from './type';

export function currentTask(state: State): Task {
  return state.tasks[state.currentTask];
}

export function documentTree(task: Task): Array<Object> {
  return task.files.reduce((docs, file) => {
    const [docSlug, edType, filename] = file.path.split('/');
    let document = docs.find(d => d.slug === docSlug);
    if (!document) {
      document = {
        slug: docSlug,
        title: task.documentTitles[docSlug],
        editions: [],
      };
      docs.push(document);
    }
    let edition = document.editions.find(e => e.type === edType);
    if (!edition) {
      edition = {
        type: edType,
        files: [],
      }
      document.editions.push(edition);
    }
    edition.files.push({
      filename,
      path: file.path,
      edited: !!file.editedContent && file.editedContent !== file.content,
    });
    return docs;
  }, []);
}
