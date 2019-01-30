// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer({}, {
  RECEIVE_ACCESS_TOKEN: (state, { payload }) => {
    state.token = payload;
  },

  RECEIVE_GITHUB_USER: (state, { payload }) => {
    state.name = payload.name;
    state.avatar = payload.avatar;
    state.user = payload.user;
  }
})
