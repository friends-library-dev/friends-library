import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thunk } from './';
import Service from '../lib/service';
import * as keys from '../lib/keys';
import { downloadAudio } from './filesystem';
import { set as setActivePart } from './active-part';
import { trackData } from './selectors';

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

export const play = (
  audioId: string,
  partIndex: number,
  position: number,
): Thunk => async (dispatch, getState) => {
  const state = getState();
  Service.audioPlayTrack(
    trackData(audioId, partIndex, state.preferences.audioQuality, state),
  );
  dispatch(setActivePart({ audioId, partIndex }));
  dispatch(set({ audioId, state: `PLAYING` }));
};

export const pause = (): Thunk => async (dispatch) => {
  Service.audioPause();
  dispatch(setState(`PAUSED`));
};

export const togglePlayback = (audioId: string): Thunk => async (dispatch, getState) => {
  const { playback, preferences: prefs, filesystem: fs } = getState();
  const partIndex = 0; // in the future, grab from RESUME state
  const position = 0; // maybe grab this from RESUME state too?
  const path = keys.audioFilePath(audioId, partIndex, prefs.audioQuality);
  const file = fs[path];
  const hasFile = file && file.bytesOnDisk === file.totalBytes;

  if (!hasFile) {
    // typings are incorrect here, this actually DOES return a promise
    await dispatch(downloadAudio(audioId, partIndex, prefs.audioQuality));
  }

  if (audioId === playback.audioId && playback.state === `PLAYING`) {
    dispatch(pause());
    return;
  }

  if (audioId === playback.audioId && playback.state === `PAUSED`) {
    dispatch(resume());
    return;
  }

  if (playback.state === `STOPPED`) {
    dispatch(play(audioId, partIndex, position));
    return;
  }
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
