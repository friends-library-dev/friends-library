// @flow
import type { State, Task, File } from './type';
import { values } from './lib/utils';

export function currentTask(state: State): ?Task {
  if (!state.currentTask) {
    return null;
  }
  return state.tasks[state.currentTask];
}

export function searchedFiles(state: State): Array<File> {
  const { searching, documentSlug, editionType } = state.search;
  const task = currentTask(state);
  if (!task || !searching) {
    return [];
  }

  return values(task.files).filter(file => {
    const [docSlug, edType] = file.path.split('/');
    if (documentSlug && docSlug !== documentSlug) {
      return false;
    }

    if (editionType && edType !== editionType) {
      return false;
    }

    return true;
  });
}

export function documentTree(task: Task): Array<*> {
  const documents = values(task.files).reduce((docs, file) => {
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

  documents.forEach(doc => {
    doc.editions = doc.editions.sort(({ type }) => {
      switch (type) {
        case 'updated':
          return -1;
        case 'modernized':
          return 0;
        default:
          return 1;
      }
    });
  });

  return documents;
}
