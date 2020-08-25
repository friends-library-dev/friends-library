import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioResource } from '../types';
import { Thunk } from './';

type AudiosState = Record<string, AudioResource>;

const initialState: AudiosState = {};

const audiosSlice = createSlice({
  name: `audios`,
  initialState,
  reducers: {
    replace: (state, action: PayloadAction<AudioResource[]>) => {
      return action.payload.reduce((acc, audio) => {
        acc[audio.id] = audio;
        return acc;
      }, {} as AudiosState);
    },
  },
});

export const { replace } = audiosSlice.actions;
export default audiosSlice.reducer;

export const fetchAudios = (): Thunk => async (dispatch) => {
  try {
    const res = await fetch(`https://api.friendslibrary.com/app-audios`);
    const resources = await res.json();
    if (resourcesValid(resources)) {
      dispatch(replace(resources));
    }
  } catch (err) {
    //
  }
};

function resourcesValid(resources: any): resources is AudioResource[] {
  return (
    Array.isArray(resources) &&
    resources.every((r) => {
      return typeof r.artwork === `string` && Array.isArray(r.parts);
    })
  );
}
