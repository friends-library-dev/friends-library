// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer(null, {
  CREATE_TASK: (state, action) => {
    return action.payload.taskId;
  },

  DELETE_TASK: (state, { payload }) => {
    if (state === payload) {
      return null;
    }
    return state;
  },

  CHANGE_SCREEN: (state, action) => {
    if (action.payload === 'TASKS') {
      return null;
    }
    return state;
  },

  WORK_ON_TASK: (state, { payload }) => {
    return payload;
  },
});
