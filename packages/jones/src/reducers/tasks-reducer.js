// @flow
import { createReducer } from 'redux-starter-kit';
import { values } from '../../../../flow-utils';

function fastForward(task, commit) {
  task.parentCommit = commit;
  values(task.files).forEach(file => {
    file.content = file.editedContent || file.content;
    file.editedContent = null;
  });
}

function replaceInResult(result, replace, files, adjust = new Map()) {
  const { path, start, end } = result;
  const file = files[path];
  const content = file.editedContent || file.content;
  const lines = content.split('\n');
  const index = start.line - 1;
  const line = lines[index];
  const prevLength = line.length;
  const key = `${result.path}:${index}`;

  if (!adjust.has(key)) {
    adjust.set(key, 0);
  }

  const offset = adjust.get(key) || 0;

  lines[index] = [
    line.substring(0 - offset, start.column - offset),
    replace,
    line.substring(end.column - offset)
  ].join('');

  const diff = prevLength - lines[index].length;
  adjust.set(key, offset + diff);
  file.editedContent = lines.join('\n');
}

export default createReducer({}, {
  REPLACE_IN_RESULT: (state, { payload: { taskId, result, replace } }) => {
    const task = state[taskId];
    if (task) {
      task.editingFile = result.path;
      replaceInResult(result, replace, task.files);
    }
  },

  REPLACE_IN_RESULTS: (state, { payload: { taskId, results, replace } }) => {
    const task = state[taskId];
    if (task) {
      const adjust = new Map();
      results.forEach(r => replaceInResult(r, replace, task.files, adjust));
    }
  },

  CREATE_TASK: (state, action) => {
    const { payload: { taskId } } = action;
    const time = (new Date()).toJSON();
    state[taskId] = {
      id: taskId,
      name: '',
      repoId: null,
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

  EDIT_SEARCH_RESULT: (state, { payload: { taskId, result } }) => {
    const task = state[taskId];
    if (task) {
      task.editingFile = result.path;
    }
  },

  TASK_SUBMITTED: (state, { payload: { id, prNumber, parentCommit } }) => {
    const task = state[id];
    if (task) {
      task.prNumber = prNumber;
      fastForward(task, parentCommit);
    }
  },

  TASK_RE_SUBMITTED: (state, { payload: { id, parentCommit } }) => {
    const task = state[id];
    if (task) {
      fastForward(task, parentCommit);
    }
  },

  TOGGLE_SIDEBAR_OPEN: (state, { payload: { id } }) => {
    const task = state[id];
    if (task) {
      task.sidebarOpen = !task.sidebarOpen;
    }
  },

  UPDATE_SIDEBAR_WIDTH: (state, { payload: { id, width } }) => {
    const task = state[id];
    if (task) {
      task.sidebarWidth = width;
    }
  },

  UPDATE_EDITING_FILE: (state, { payload: { id, adoc } }) => {
    const task = state[id];
    if (!task) {
      return;
    }

    const { files, editingFile } = task;
    const file = files[editingFile];
    if (adoc === file.content) {
      file.editedContent = null;
    } else {
      file.editedContent = adoc;
    }
  },

  UPDATE_TASK: (state, { payload }) => {
    const task = state[payload.id];
    if (task) {
      Object.keys(payload.data).forEach(key => {
        task[key] = payload.data[key];
      });
      task.updated = (new Date()).toJSON();
    }
  },

  TOUCH_TASK: (state, { payload: taskId }) => {
    const task = state[taskId];
    if (task) {
      task.updated = (new Date()).toJSON();
    }
  },

  COLLAPSE_TASK: (state, { payload: { taskId, key, isCollapsed } }) => {
    const task = state[taskId];
    if (task) {
      task.collapsed[key] = !isCollapsed;
    }
  },

  DELETE_TASK: (state, { payload }) => {
    delete state[payload];
  },
});
