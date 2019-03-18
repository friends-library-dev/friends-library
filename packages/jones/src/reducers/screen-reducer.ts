import { createReducer } from 'redux-starter-kit';
import * as screens from '../screens';
import { Action } from '../type';

export default createReducer(screens.TASKS, {
  CHANGE_SCREEN: (state: string, action: Action) => action.payload,
  WORK_ON_TASK: () => screens.WORK,
});
