import { combineReducers } from '@reduxjs/toolkit';
import audioResources from './audio-resources';
import filesystem from './filesystem';
import playback from './playback';

const rootReducer = combineReducers({
  audioResources,
  filesystem,
  playback,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
