import { combineReducers } from '@reduxjs/toolkit';
import audioResources from './audio-resources';
import filesystem from './filesystem';

const rootReducer = combineReducers({
  audioResources,
  filesystem,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
