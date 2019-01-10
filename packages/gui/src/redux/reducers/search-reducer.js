// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  searching: false,
  documentSlug: null,
  editionType: null,
  regexp: false,
  caseSensitive: false,
  string: null,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  },
});
