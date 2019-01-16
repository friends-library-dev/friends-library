// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer([], {
  RECEIVE_FRIEND_REPOS: (state, { payload: repos }) => {
    return repos.map(repo => ({
      id: repo.id,
      slug: repo.name,
      friendName: repo.description.replace(
        /^.. (.+) \(\d.+$/,
        (_, name) => name,
      ),
    }));
  }
});
