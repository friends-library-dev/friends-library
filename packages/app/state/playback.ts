import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thunk } from './';
import Service from '../lib/service';
import * as keys from '../lib/keys';
import { downloadAudio } from './filesystem';
import { trackData } from './selectors';

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
    setState: (state, action: PayloadAction<PlaybackState['state']>) => {
      state.state = action.payload;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
  },
});

export const { setPosition, setState } = playback.actions;
export default playback.reducer;

export const resume = (): Thunk => async (dispatch) => {
  Service.resumeAudioPlayback();
  dispatch(setState(`PLAYING`));
};

export const play = (
  audioId: string,
  partIndex: number,
  position: number,
): Thunk => async (dispatch, getState) => {
  const state = getState();
  Service.playAudioTrack(
    trackData(audioId, partIndex, state.preferences.audioQuality, state),
  );
  dispatch(setState(`PLAYING`));
};

export const pause = (): Thunk => async (dispatch) => {
  Service.pauseAudioPlayback();
  dispatch(setState(`PAUSED`));
};

export const togglePlayback = (audioId: string): Thunk => async (dispatch, getState) => {
  const { playback, preferences: prefs, filesystem: fs } = getState();
  const partIndex = 0; // in the future, grab from RESUME state
  const position = 0; // maybe grab this from RESUME state too?
  const path = keys.audioFilePath(audioId, partIndex, prefs.audioQuality);
  const hasFile = path in fs && fs[path].bytesOnDisk === fs[path].totalBytes;

  if (!hasFile) {
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
