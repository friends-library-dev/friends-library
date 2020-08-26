import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlaybackState {
  audio: string | null;
  partIndex: number | null;
  position: number | null;
}

const initialState: PlaybackState = {
  audio: null,
  partIndex: null,
  position: null,
};

const playback = createSlice({
  name: `playback`,
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
  },
});

export const { setPosition } = playback.actions;
export default playback.reducer;
