import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';
import { AudioResource } from '../types';
import Service from '../lib/service';
import FS from '../lib/fs';
import * as keys from '../lib/keys';
import { set as setLocalAudioFile } from './local-audio-files';
import { Thunk, Dispatch } from '.';

type AudioResourcesState = Record<string, AudioResource>;

const initialState: AudioResourcesState = {};

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
  const audios = await Service.loadAudios();
  if (audios && Object.keys(getState().audioResources).length === 0) {
    dispatch(replace(audios));
    setAllLocalAudioFileState(dispatch, audios);
  }
};

export const fetchAudios = (): Thunk => async (dispatch) => {
  const audios = await Service.fetchAudios();
  if (audios) {
    dispatch(replace(audios));
    setAllLocalAudioFileState(dispatch, audios);
  }
};

async function setAllLocalAudioFileState(
  dispatch: Dispatch,
  audioResources: AudioResource[],
) {
  const files: { id: string; partIndex: number; quality: AudioQuality }[] = [];
  for (let audio of audioResources) {
    for (let partIndex = 0; partIndex < audio.parts.length; partIndex++) {
      files.push({ id: audio.id, partIndex, quality: `HQ` });
      files.push({ id: audio.id, partIndex, quality: `LQ` });
    }
  }

  files.forEach(async ({ id, partIndex, quality }) => {
    const downloaded = await FS.hasAudio(id, partIndex, quality);
    dispatch(
      setLocalAudioFile({
        id: keys.partWithQuality(id, partIndex, quality),
        fileState: {
          downloaded,
          downloading: false,
          percentDownloaded: downloaded ? 100 : 0,
        },
      }),
    );
  });
}
