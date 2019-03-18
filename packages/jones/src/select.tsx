import { State, Task, File } from './type';
import { EditionType, FilePath } from '@friends-library/types';

export function currentTask(state: State): Task | null {
  if (!state.currentTask) {
    return null;
  }
  return state.tasks.present[state.currentTask];
}

export function requireCurrentTask(state: State): Task {
  const task = currentTask(state);
  if (!task) throw new Error('There is no current task');
  return task;
}

export function currentTaskFriendName(state: State): string {
  const task = currentTask(state);
  if (!task) {
    return '';
  }

  const repo = state.repos.find(r => r.id === task.repoId);
  if (!repo) {
    return '';
  }

  return repo.friendName;
}

export function searchedFiles(state: State): File[] {
  const { searching, documentSlug, editionType, filename } = state.search;
  const task = currentTask(state);
  if (!task || !searching) {
    return [];
  }

  return Object.values(task.files).filter(file => {
    const [docSlug, edType, basename] = file.path.split('/');
    if (documentSlug && docSlug !== documentSlug) {
      return false;
    }

    if (editionType && edType !== editionType) {
      return false;
    }

    if (filename && basename !== filename) {
      return false;
    }

    return true;
  });
}

export type DocumentFile = {
  filename: string;
  path: FilePath;
  edited: boolean;
};

export type DocumentEdition = {
  type: EditionType;
  path: FilePath;
  files: DocumentFile[];
};

export type Document = {
  slug: string;
  title: string;
  editions: DocumentEdition[];
};

export function documentTree(task: Task): Document[] {
  let documents: Document[] = [];
  documents = Object.values(task.files).reduce((docs: Document[], file: File) => {
    const [docSlug, edType, filename] = file.path.split('/');
    let document = docs.find(d => d.slug === docSlug);
    if (!document) {
      document = {
        slug: docSlug,
        title: task.documentTitles[docSlug],
        editions: [] as DocumentEdition[],
      };
      docs.push(document);
    }
    let edition = document.editions.find(e => e.type === edType);
    if (!edition) {
      edition = {
        path: file.path,
        type: edType as EditionType,
        files: [],
      };
      document.editions.push(edition as DocumentEdition);
    }
    edition.files.push({
      filename,
      path: file.path,
      edited: !!file.editedContent && file.editedContent !== file.content,
    });
    return docs;
  }, documents);

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
