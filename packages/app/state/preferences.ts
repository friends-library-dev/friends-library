import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';

export interface PreferencesState {
  audioQuality: AudioQuality;
}

export const initialState: PreferencesState = {
  audioQuality: `HQ`,
};

const preferences = createSlice({
  name: `preferences`,
  initialState,
  reducers: {
    setQuality: (state, action: PayloadAction<AudioQuality>) => {
      state.audioQuality = action.payload;
    },
    toggleQuality: (state) => {
      state.audioQuality = state.audioQuality === `HQ` ? `LQ` : `HQ`;
    },
  },
});

export const { setQuality, toggleQuality } = preferences.actions;
export default preferences.reducer;
