import { createReducer } from 'redux-starter-kit';

interface Prefs {
  editorFontSize: number;
}

export const defaultState = {
  editorFontSize: 15,
};

export default createReducer(defaultState, {
  INCREASE_EDITOR_FONT_SIZE: (state: Prefs) => {
    state.editorFontSize++;
  },

  DECREASE_EDITOR_FONT_SIZE: (state: Prefs) => {
    state.editorFontSize--;
  },

  UPDATE_PREFS: (state: Prefs, { payload }: { payload: Prefs }) => {
    return {
      ...state,
      ...payload,
    };
  },
});
