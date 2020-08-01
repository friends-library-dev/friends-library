import { createReducer } from 'redux-starter-kit';
import { Search } from '../type';

export const defaultState = {
  searching: false,
  caseSensitive: false,
  regexp: false,
  words: true,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state: Search, { payload }: any) => {
    Object.keys(payload).forEach((key) => {
      // @ts-ignore
      state[key] = payload[key];
    });
  },

  TOGGLE_SEARCH_CASE_SENSITIVE: (state: Search) => {
    state.caseSensitive = !state.caseSensitive;
  },

  TOGGLE_SEARCH_REGEXP: (state: Search) => {
    state.regexp = !state.regexp;
  },

  TOGGLE_SEARCH_WORDS: (state: Search) => {
    state.words = !state.words;
  },

  CANCEL_SEARCH: () => {
    return defaultState;
  },

  WORK_ON_TASK: () => {
    return defaultState;
  },
});
