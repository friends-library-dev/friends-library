import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as keys from '../lib/keys';
import * as select from './selectors';
import { Thunk } from './';

export type TrackPositionState = Record<string, number | undefined>;

export const initialState: TrackPositionState = {};

const trackPosition = createSlice({
  name: `trackPosition`,
  initialState,
  reducers: {
    setTrackPosition: (
      state,
      action: PayloadAction<{ audioId: string; partIndex: number; position: number }>,
    ) => {
      const { audioId, partIndex, position } = action.payload;
      const key = keys.part(audioId, partIndex);
      state[key] = position;
    },
  },
});

export const { setTrackPosition } = trackPosition.actions;
export default trackPosition.reducer;

export const setCurrentTrackPosition = (position: number): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const { audioId } = state.playback;
  if (!audioId) return;
  const partIndex = select.audioActivePartIndex(audioId, state);
  dispatch(setTrackPosition({ audioId, partIndex, position }));
};
