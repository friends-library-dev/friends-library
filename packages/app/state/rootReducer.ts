import { combineReducers } from '@reduxjs/toolkit';
import audioResources from './audio-resources';
import filesystem from './filesystem';
import playback from './playback';
import preferences from './preferences';
import trackPosition from './track-position';
import activePart from './active-part';
import network from './network';

const rootReducer = combineReducers({
  audioResources,
  filesystem,
  playback,
  preferences,
  trackPosition,
  activePart,
  network,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
