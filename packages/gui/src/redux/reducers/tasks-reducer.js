// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer([], {
  REHYDRATE: (state, action) => {
    return action.payload.tasks;
  },

  CREATE_TASK: (state, action) => {
    const { payload: { taskId } } = action;
    const time = (new Date()).toJSON();
    state[taskId] = {
      id: taskId,
      name: '',
      repo: '',
      created: time,
      updated: time,
      isNew: true,
      collapsed: {},
    };
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
