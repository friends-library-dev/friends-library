// @flow
import { createReducer } from 'redux-starter-kit'

export default createReducer([], {
  CREATE_TASK: (state, action) => {
    const { payload: { taskId } } = action;
    state[taskId] = {
      id: taskId,
      name: '',
      repo: '',
      isNew: true,
    }
  },
  UPDATE_TASK: (state, { payload }) => {
    const task = state[payload.id];
    if (task) {
      Object.keys(payload.data).forEach(key => task[key] = payload.data[key]);
    }
  },
  DELETE_TASK: (state, { payload }) => {
    delete state[payload];
  }
})
