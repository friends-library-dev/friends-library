// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  token: null,
};

export default createReducer(defaultState, {
  RECEIVE_ACCESS_TOKEN: (state, { payload }) => {
    state.token = payload;
  },

  RECEIVE_GITHUB_USER: (state, { payload }) => {
    state.name = payload.name;
    state.avatar = payload.avatar;
  }
})
