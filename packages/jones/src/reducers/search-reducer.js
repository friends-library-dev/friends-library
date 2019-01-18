// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  searching: false,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    }
  },

  CANCEL_SEARCH: () => {
    return defaultState;
  },

  WORK_ON_TASK: () => {
    return defaultState;
  }
});
