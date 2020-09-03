import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as keys from '../lib/keys';
import * as select from './selectors';
import Service from '../lib/service';
import { Thunk, Dispatch, State } from './';

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

export const seekTo = (
  audioId: string,
  partIndex: number,
  position: number,
): Thunk => async (dispatch, getState) => {
  return seek(audioId, partIndex, () => position, getState, dispatch);
};

export const seekRelative = (
  audioId: string,
  partIndex: number,
  delta: number,
): Thunk => async (dispatch, getState) => {
  return seek(audioId, partIndex, (current) => current + delta, getState, dispatch);
};

function seek(
  audioId: string,
  partIndex: number,
  getNewPosition: (currentPosition: number) => number,
  getState: () => State,
  dispatch: Dispatch,
): void {
  const state = getState();
  const audioPart = select.audioPart(audioId, partIndex, state);
  if (!audioPart) return;
  const [part] = audioPart;
  const currentPosition = select.trackPosition(audioId, partIndex, state);
  const newPosition = Math.max(
    0,
    Math.min(part.duration, getNewPosition(currentPosition)),
  );
  dispatch(setTrackPosition({ audioId, partIndex, position: newPosition }));
  if (select.isAudioPartActive(audioId, partIndex, state)) {
    Service.audioSeekTo(newPosition);
  }
}
