import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thunk } from './';
import Service from '../lib/service';
import { downloadAudio, isDownloaded } from './filesystem';
import { set as setActivePart } from './active-part';
import * as select from './selectors';
import { seekTo } from './track-position';

export interface PlaybackState {
  audioId: string | null;
  state: 'STOPPED' | 'PLAYING' | 'PAUSED';
}

export const initialState: PlaybackState = {
  audioId: null,
  state: 'STOPPED',
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

export const resume = (): Thunk => async (dispatch) => {
  Service.audioResume();
  dispatch(setState(`PLAYING`));
};

export const play = (audioId: string, partIndex: number): Thunk => async (
  dispatch,
  getState,
) => {
  const track = select.trackData(audioId, partIndex, getState());
  if (track) {
    dispatch(setActivePart({ audioId, partIndex }));
    dispatch(set({ audioId, state: `PLAYING` }));
    return Service.audioPlayTrack(track);
  }
  return Promise.resolve();
};

export const pause = (): Thunk => async (dispatch) => {
  Service.audioPause();
  dispatch(setState(`PAUSED`));
};

export const togglePlayback = (audioId: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const { playback } = state;
  const audioPart = select.activeAudioPart(audioId, state);
  if (!audioPart) return;
  const [part] = audioPart;
  const position = select.trackPosition(audioId, part.index, state);
  const file = select.audioPartFile(audioId, part.index, state);

  if (!isDownloaded(file)) {
    // typings are incorrect here, this actually DOES return a promise
    await dispatch(downloadAudio(audioId, part.index));
  }

  if (audioId === playback.audioId && playback.state === `PLAYING`) {
    dispatch(pause());
    return;
  }

  if (audioId === playback.audioId && playback.state === `PAUSED`) {
    dispatch(seekTo(audioId, part.index, position));
    dispatch(resume());
    return;
  }

  await dispatch(play(audioId, part.index));
  dispatch(seekTo(audioId, part.index, position));
};

/* 
1) player is actively playing the audio
  -> PAUSE playback

2) player is puased playing the audio
  -> RESUME playback

3) player is STOPPED (nothing is playing)
  -> WAIT for track to DOWNLOAD (if necessary)
  -> PLAY track at position X (X = 0 for now, but might become stored RESUME STATE)

4) player is PLAYING a DIFFERENT audio altogether
  -> STOP the current track
  -> goto 3)

5) player is PAUSED on a DIFFERENT audio altogether
  -> STOP the current track ???
  -> goto 3)

*/
