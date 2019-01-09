// @flow
import { createReducer } from 'redux-starter-kit';

export default createReducer(null, {
  SET_EDITING_FILE: (state, { payload }) => payload,
  WORK_ON_TASK: () => null,
});
