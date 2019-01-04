// @flow
import { createReducer } from 'redux-starter-kit'
import * as screens from '../screens';

export default createReducer(screens.TASKS, {
  CHANGE_SCREEN: (state, action) => action.payload,
  WORK_ON_TASK: () => screens.WORK,
})
