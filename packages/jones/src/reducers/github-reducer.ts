import { createReducer } from 'redux-starter-kit';
import { GitHub, Action } from '../type';

export default createReducer(
  {},
  {
    LOGOUT: () => ({ token: null }),

    RECEIVE_ACCESS_TOKEN: (state: GitHub, { payload }: Action) => {
      state.token = payload;
    },

    RECEIVE_GITHUB_USER: (state: GitHub, { payload }: Action) => {
      return {
        ...state,
        name: payload.name,
        avatar: payload.avatar,
        user: payload.user,
      };
    },
  },
);
