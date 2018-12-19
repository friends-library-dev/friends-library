import { createReducer } from 'redux-starter-kit'

export default {
  repos: createReducer([], {
    RECEIVE_REPOS: (state, action) => {
      console.log(action);
      return action.payload;
    }
  }),
};
