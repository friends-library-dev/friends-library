// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer([], {
  RECEIVE_REPOS: (state, action) => {
    const repos = {};
    action.payload.forEach(repo => {
      repos[`en/${repo.name}`] = {
        slug: repo.name,
        sshUrl: repo.ssh_url,
      };
    });
    return repos;
  },
});
