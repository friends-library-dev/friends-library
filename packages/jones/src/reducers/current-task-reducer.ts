import { createReducer } from 'redux-starter-kit';
import { Uuid } from '@friends-library/types';
import { Action } from '../type';

export default createReducer(null, {
  CREATE_TASK: (state: Uuid | null, action: Action) => {
    return action.payload.taskId;
  },

  DELETE_TASK: (state: Uuid | null, { payload }: Action) => {
    if (state === payload) {
      return null;
    }
    return state;
  },

  CHANGE_SCREEN: (state: Uuid | null, action: Action) => {
    if (action.payload === 'TASKS') {
      return null;
    }
    return state;
  },

  WORK_ON_TASK: (state: Uuid | null, { payload }: { payload: Uuid }) => {
    return payload;
  },
});
