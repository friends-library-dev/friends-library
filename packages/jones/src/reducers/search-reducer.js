// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  searching: false,
  caseSensitive: false,
  regexp: false,
  words: true,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state, { payload }) => {
    Object.keys(payload).forEach(key => {
      state[key] = payload[key];
    });
  },

  TOGGLE_SEARCH_CASE_SENSITIVE: state => {
    state.caseSensitive = !state.caseSensitive;
  },

  TOGGLE_SEARCH_REGEXP: state => {
    state.regexp = !state.regexp;
  },

  TOGGLE_SEARCH_WORDS: state => {
    state.words = !state.words;
  },

  CANCEL_SEARCH: () => {
    return defaultState;
  },

  WORK_ON_TASK: () => {
    return defaultState;
  }
});
