import { combineReducers } from '@reduxjs/toolkit';
import audios from './audios';

const rootReducer = combineReducers({
  audios,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
