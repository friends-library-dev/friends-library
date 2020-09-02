import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thunk } from './';
import * as select from './selectors';
import * as keys from '../lib/keys';

export type ActivePartState = Record<string, number | null>;

export const initialState: ActivePartState = {};

const activePart = createSlice({
  name: `activePart`,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ audioId: string; partIndex: number }>) => {
      const { audioId, partIndex } = action.payload;
      state[audioId] = partIndex;
    },
  },
});

export const { set } = activePart.actions;
export default activePart.reducer;

/**
 * When a track ends, RNTP will proceed to the next track queued
 * if there is one. The only way we can know this, is by the
 * `playback-track-changed` event, which also fires at other times
 * when the queue is not auto-advancing. This determines
 * which changes were caused by queue auto-advancing, and therefore
 * which ones we need to opt in to updating out state with.
 */
export const maybeAdvanceQueue = (nextTrackId: string): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const current = select.currentlyPlayingPart(state);
  if (!current) return;
  const [part, audio] = current;
  const currentPartId = keys.part(audio.id, part.index);
  if (currentPartId === nextTrackId) {
    // we already know we're playing this track
    return;
  }
  const nextIndex = part.index + 1;
  if (!audio.parts[nextIndex]) return;
  const nextPartId = keys.part(audio.id, nextIndex);
  if (nextPartId === nextTrackId) {
    dispatch(set({ audioId: audio.id, partIndex: nextIndex }));
  }
};
