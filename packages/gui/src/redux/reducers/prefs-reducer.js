// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  editorFontSize: 13,
};

export default createReducer(defaultState, {
  REHYDRATE: (state, action) => {
    return action.payload.prefs;
  },

  INCREASE_EDITOR_FONT_SIZE: (state) => {
    state.editorFontSize++;
  },

  DECREASE_EDITOR_FONT_SIZE: (state) => {
    state.editorFontSize--;
  },

  UPDATE_PREFS: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  },
});
