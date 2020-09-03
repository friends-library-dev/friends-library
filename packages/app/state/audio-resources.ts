import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';
import { AudioResource } from '../types';
import Service from '../lib/service';
import { setUndownloadedAudios } from './filesystem';
import { Thunk, Dispatch } from '.';

type AudioResourcesState = Record<string, AudioResource | undefined>;

export const initialState: AudioResourcesState = {};

const audioResourcesSlice = createSlice({
  name: `audio-resources`,
  initialState,
  reducers: {
    replace: (state, action: PayloadAction<AudioResource[]>) => {
      return action.payload.reduce((acc, audio) => {
        acc[audio.id] = audio;
        return acc;
      }, {} as AudioResourcesState);
    },
  },
});

export const { replace } = audioResourcesSlice.actions;
export default audioResourcesSlice.reducer;

export const loadAudios = (): Thunk => async (dispatch, getState) => {
  const audios = await Service.fsLoadAudios();
  if (audios && Object.keys(getState().audioResources).length === 0) {
    dispatch(replace(audios));
    setAllUndownloadedAudios(dispatch, audios);
  }
};

export const fetchAudios = (): Thunk => async (dispatch) => {
  const audios = await Service.networkFetchAudios();
  if (audios) {
    dispatch(replace(audios));
    setAllUndownloadedAudios(dispatch, audios);
    Service.fsSaveAudioResources(audios);
  }
};

function setAllUndownloadedAudios(
  dispatch: Dispatch,
  audioResources: AudioResource[],
): void {
  const files: {
    audioId: string;
    partIndex: number;
    quality: AudioQuality;
    numBytes: number;
  }[] = [];
  for (const audio of audioResources) {
    for (const part of audio.parts) {
      files.push({
        audioId: audio.id,
        partIndex: part.index,
        quality: `HQ`,
        numBytes: part.size,
      });
      files.push({
        audioId: audio.id,
        partIndex: part.index,
        quality: `LQ`,
        numBytes: part.sizeLq,
      });
    }
  }
  dispatch(setUndownloadedAudios(files));
}
