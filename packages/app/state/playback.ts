import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import Service from '../lib/service';
import { State, Dispatch, Thunk } from './';
import { downloadAudio, isDownloaded } from './filesystem';
import { set as setActivePart } from './active-part';
import * as select from './selectors';
import { seekTo } from './track-position';
import { AudioPart } from '../types';
import { canDownloadNow } from '../state/network';
import * as keys from '../lib/keys';

export interface PlaybackState {
  audioId: string | null;
  state: 'STOPPED' | 'PLAYING' | 'PAUSED';
}

export const initialState: PlaybackState = {
  audioId: null,
  state: `STOPPED`,
};

const playback = createSlice({
  name: `playback`,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<PlaybackState>) => {
      return action.payload;
    },
    setState: (state, action: PayloadAction<PlaybackState['state']>) => {
      state.state = action.payload;
    },
  },
});

export const { setState, set } = playback.actions;
export default playback.reducer;

export const skipNext = (): Thunk => async (dispatch, getState) => {
  skip(true, dispatch, getState());
};

export const skipBack = (): Thunk => async (dispatch, getState) => {
  skip(false, dispatch, getState());
};

async function skip(forward: boolean, dispatch: Dispatch, state: State): Promise<void> {
  const current = select.currentlyPlayingPart(state);
  if (!current) return;
  const [part, audio] = current;
  const nextIndex = part.index + (forward ? 1 : -1);
  const next = audio.parts[nextIndex];
  if (!next) return;
  dispatch(setActivePart({ audioId: audio.id, partIndex: next.index }));
  Service.audioPause();
  dispatch(setState(`PAUSED`));
  const file = select.audioPartFile(audio.id, next.index, state);
  if (!isDownloaded(file)) {
    // typings are incorrect here, this actually DOES return a promise
    await dispatch(downloadAudio(audio.id, next.index));
  }
  forward ? Service.audioSkipNext() : Service.audioSkipBack();
  if (Platform.OS === `android`) {
    Service.audioResume();
  }
  dispatch(setState(`PLAYING`));
}

export const resume = (): Thunk => async (dispatch) => {
  Service.audioResume();
  dispatch(setState(`PLAYING`));
};

export const play = (audioId: string, partIndex: number): Thunk => async (
  dispatch,
  getState,
) => {
  const queue = select.trackQueue(audioId, getState());
  if (queue) {
    dispatch(setActivePart({ audioId, partIndex }));
    dispatch(set({ audioId, state: `PLAYING` }));
    return Service.audioPlayTrack(keys.part(audioId, partIndex), queue);
  }
  return Promise.resolve();
};

export const pause = (): Thunk => async (dispatch) => {
  Service.audioPause();
  dispatch(setState(`PAUSED`));
};

export const togglePartPlayback = (audioId: string, partIndex: number): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const audioPart = select.audioPart(audioId, partIndex, state);
  if (!audioPart) return;
  const [part] = audioPart;
  execTogglePartPlayback(audioId, part, dispatch, state);
};

export const togglePlayback = (audioId: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const audioPart = select.activeAudioPart(audioId, state);
  if (!audioPart) return;
  const [part] = audioPart;
  execTogglePartPlayback(audioId, part, dispatch, state);
};

async function execTogglePartPlayback(
  audioId: string,
  part: AudioPart,
  dispatch: Dispatch,
  state: State,
): Promise<void> {
  const file = select.audioPartFile(audioId, part.index, state);

  if (!isDownloaded(file)) {
    if (!canDownloadNow(state, dispatch)) {
      return;
    }
    // typings are incorrect here, this actually DOES return a promise
    await dispatch(downloadAudio(audioId, part.index));
  }

  if (select.isAudioPartPlaying(audioId, part.index, state)) {
    dispatch(pause());
    return;
  }

  const position = select.trackPosition(audioId, part.index, state);
  if (select.isAudioPartPaused(audioId, part.index, state)) {
    dispatch(seekTo(audioId, part.index, position));
    dispatch(resume());
    return;
  }

  await dispatch(play(audioId, part.index));
  dispatch(seekTo(audioId, part.index, position));
}

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
  if (nextPartId !== nextTrackId) {
    return;
  }

  const file = select.audioPartFile(audio.id, nextIndex, state);
  if (!state.network.connected && !isDownloaded(file)) {
    // we can't go to the next track, because we don't have the track or internet
    dispatch(pause());
    return;
  }

  dispatch(setActivePart({ audioId: audio.id, partIndex: nextIndex }));
};
