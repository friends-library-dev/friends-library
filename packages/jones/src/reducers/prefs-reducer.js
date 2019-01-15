// @flow
import { createReducer } from 'redux-starter-kit';

export const defaultState = {
  editorFontSize: 13,
};

export default createReducer(defaultState, {
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
