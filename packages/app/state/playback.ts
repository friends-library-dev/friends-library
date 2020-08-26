import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlaybackState {
  audioId: string | null;
  partIndex: number | null;
  position: number | null;
  state: 'STOPPED' | 'PLAYING' | 'PAUSED';
}

export const initialState: PlaybackState = {
  audioId: null,
  partIndex: null,
  position: null,
  state: 'STOPPED',
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
