import { createReducer } from 'redux-starter-kit';
import { Task, SearchResult, File, Tasks, Action } from '../type';
import { Uuid } from '@friends-library/types';

function fastForward(task: Task, commit: string): void {
  task.parentCommit = commit;
  Object.values(task.files).forEach(file => {
    file.content = file.editedContent || file.content;
    file.editedContent = null;
  });
}

function replaceInResult(
  result: SearchResult,
  replace: string,
  files: { [key: string]: File },
  adjust: Map<string, number> = new Map(),
): void {
  const { path, start, end } = result;
  const file = files[path];
  const content = file.editedContent || file.content;
  const lines = content.split(`\n`);
  const index = start.line - 1;
  const line = lines[index];
  const prevLength = line.length;
  const key = `${path}:${index}`;

  if (!adjust.has(key)) {
    adjust.set(key, 0);
  }

  const offset = adjust.get(key) || 0;

  lines[index] = [
    line.substring(0 - offset, start.column - offset),
    replace,
    line.substring(end.column - offset),
  ].join(``);

  const diff = prevLength - lines[index].length;
  adjust.set(key, offset + diff);
  file.editedContent = lines.join(`\n`);
}

export default createReducer(
  {},
  {
    REPLACE_IN_RESULT: (
      state: Tasks,
      {
        payload: { taskId, result, replace },
      }: {
        payload: {
          taskId: string;
          result: SearchResult;
          replace: string;
        };
      },
    ) => {
      const task = state[taskId];
      if (task) {
        task.editingFile = result.path;
        replaceInResult(result, replace, task.files);
      }
    },

    REPLACE_IN_RESULTS: (
      state: Tasks,
      {
        payload: { taskId, results, replace },
      }: {
        payload: {
          taskId: string;
          results: SearchResult[];
          replace: string;
        };
      },
    ) => {
      const task = state[taskId];
      if (task) {
        const adjust = new Map();
        results.forEach(r => replaceInResult(r, replace, task.files, adjust));
      }
    },

    REOPEN_TASK: (
      state: Tasks,
      { payload: { id: oldId, newId } }: { payload: { id: Uuid; newId: Uuid } },
    ) => {
      const task = state[oldId];
      if (!task) {
        return;
      }
      delete state[oldId];
      task.id = newId;
      delete task.pullRequest;
      state[newId] = task;
    },

    CREATE_TASK: (state: Tasks, action: Action) => {
      const {
        payload: { taskId },
      } = action;
      const time = new Date().toJSON();
      state[taskId] = {
        id: taskId,
        name: ``,
        repoId: -1,
        created: time,
        updated: time,
        isNew: true,
        sidebarOpen: true,
        sidebarWidth: 400,
        collapsed: {},
        documentTitles: {},
        files: {},
      };
    },

    EDIT_SEARCH_RESULT: (state: Tasks, { payload: { taskId, result } }: Action) => {
      const task = state[taskId];
      if (task) {
        task.editingFile = result.path;
      }
    },

    TASK_SUBMITTED: (
      state: Tasks,
      { payload: { id, prNumber, parentCommit } }: Action,
    ) => {
      const task = state[id];
      if (task) {
        task.pullRequest = { number: prNumber };
        fastForward(task, parentCommit);
      }
    },

    TASK_RE_SUBMITTED: (state: Tasks, { payload: { id, parentCommit } }: Action) => {
      const task = state[id];
      if (task) {
        fastForward(task, parentCommit);
      }
    },

    TOGGLE_SIDEBAR_OPEN: (state: Tasks, { payload: { id } }: Action) => {
      const task = state[id];
      if (task) {
        task.sidebarOpen = !task.sidebarOpen;
      }
    },

    UPDATE_SIDEBAR_WIDTH: (state: Tasks, { payload: { id, width } }: Action) => {
      const task = state[id];
      if (task) {
        task.sidebarWidth = width;
      }
    },

    UPDATE_EDITING_FILE: (state: Tasks, { payload: { id, adoc } }: Action) => {
      const task = state[id];
      if (!task) {
        return;
      }

      const { files, editingFile } = task;
      if (!editingFile) {
        return;
      }

      const file = files[editingFile];
      if (adoc === file.content) {
        file.editedContent = null;
      } else {
        file.editedContent = adoc;
      }
    },

    UPDATE_FILE: (state: Tasks, { payload: { id, path, adoc } }: Action) => {
      const task = state[id];
      if (!task) {
        return;
      }

      const { files } = task;
      const file = files[path];
      if (!file) {
        return;
      }

      if (adoc === file.content) {
        file.editedContent = null;
      } else {
        file.editedContent = adoc;
      }
    },

    UPDATE_TASK: (state: Tasks, { payload }: Action) => {
      const task = state[payload.id];
      if (task) {
        Object.keys(payload.data).forEach(key => {
          // @ts-ignore
          task[key] = payload.data[key];
        });
        task.updated = new Date().toJSON();
      }
    },

    TOUCH_TASK: (state: Tasks, { payload: taskId }: Action) => {
      const task = state[taskId];
      if (task) {
        task.updated = new Date().toJSON();
      }
    },

    COLLAPSE_TASK: (state: Tasks, { payload: { taskId, key, isCollapsed } }: Action) => {
      const task = state[taskId];
      if (task) {
        task.collapsed[key] = !isCollapsed;
      }
    },

    UPDATE_PULL_REQUEST_STATUS: (state: Tasks, { payload: { id, status } }: Action) => {
      const task = state[id];
      if (task && task.pullRequest) {
        task.pullRequest.status = status;
      }
    },

    DELETE_TASK: (state: Tasks, { payload }: Action) => {
      delete state[payload];
    },
  },
);
