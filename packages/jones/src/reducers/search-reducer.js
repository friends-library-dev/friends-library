// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  searching: false,
  caseSensitive: false,
  regexp: false,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state, { payload }) => {
    return {
      ...defaultState,
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
