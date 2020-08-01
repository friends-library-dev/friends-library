import { createReducer } from 'redux-starter-kit';

function pair(start: string, end: string): { [k: string]: (state: string[]) => any } {
  const type = `${start}/${end}`;
  return {
    [start]: (state) => {
      if (!state.includes(type)) {
        state.push(type);
      }
    },
    [end]: (state) => {
      return state.filter((t) => t !== type);
    },
  };
}

export default createReducer([], {
  ...pair(`REQUEST_FRIEND_REPOS`, `RECEIVE_FRIEND_REPOS`),
  ...pair(`REQUEST_GITHUB_USER`, `RECEIVE_GITHUB_USER`),
  ...pair(`SUBMITTING_TASK`, `TASK_SUBMITTED`),
  ...pair(`RE_SUBMITTING_TASK`, `TASK_RE_SUBMITTED`),
  ...pair(`START_CHECKOUT`, `END_CHECKOUT`),

  NETWORK_ERROR: () => [],
});
