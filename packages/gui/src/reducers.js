// @flow
import { createReducer } from 'redux-starter-kit'

export default {
  friends: createReducer({}, {
    RECEIVE_FRIEND: (state, action) => {
      const { payload: { friend, lang } } = action;
      state[`${lang}/${friend.slug}`] = friend;
    }
  }),
  repos: createReducer([], {
    RECEIVE_REPOS: (state, action) => {
      return action.payload.map(repo => {
        return {
          slug: repo.name,
        };
      });
    }
  }),
};
