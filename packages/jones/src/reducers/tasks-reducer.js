// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer({}, {
  REHYDRATE: (state, action) => {
    return action.payload.tasks;
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

  TASK_SUBMITTED: (state, { payload: { id, prNumber, parentCommit } }) => {
    const task = state[id];
    if (task) {
      task.prNumber = prNumber;
      task.parentCommit = parentCommit;
      Object.values(task.files).forEach(file => {
        file.content = file.editedContent || file.content;
        file.editedContent = null;
      })
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
