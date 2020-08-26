import { combineReducers } from '@reduxjs/toolkit';
import audioResources from './audio-resources';
import localAudioFiles from './local-audio-files';

const rootReducer = combineReducers({
  audioResources,
  localAudioFiles,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
