// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  searching: false,
};

export default createReducer(defaultState, {
  UPDATE_SEARCH: (state, { payload }) => {
    state.searching = !!payload.searching;
  }
});
