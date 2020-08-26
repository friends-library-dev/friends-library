import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';
import * as keys from '../lib/keys';
import { Thunk } from '.';
import Service from '../lib/service';

export interface FileState {
  totalBytes: number;
  bytesOnDisk: number;
}

export type FilesystemState = Record<string, FileState>;

export const initialState: FilesystemState = {};

const filesystemSlice = createSlice({
  name: `filesystem`,
  initialState,
  reducers: {
    setUndownloadedAudios: (
      state,
      action: PayloadAction<
        {
          audioId: string;
          partIndex: number;
          quality: AudioQuality;
          numBytes: number;
        }[]
      >,
    ) => {
      action.payload.forEach(({ audioId, partIndex, quality, numBytes }) => {
        const path = keys.audioFilePath(audioId, partIndex, quality);
        if (!state[path]) {
          state[path] = { totalBytes: numBytes, bytesOnDisk: 0 };
        }
      });
    },
    batchSet: (state, action: PayloadAction<FilesystemState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    set: (state, action: PayloadAction<{ id: string; fileState: FileState }>) => {
      const { id, fileState } = action.payload;
      state[id] = fileState;
    },
  },
});

export const { batchSet, setUndownloadedAudios, set } = filesystemSlice.actions;
export default filesystemSlice.reducer;

export const downloadFile = (path: string, url: string): Thunk => async (dispatch) => {
  const bytes = await Service.downloadFile(path, url);
  if (bytes) {
    dispatch(set({ id: path, fileState: { totalBytes: bytes, bytesOnDisk: bytes } }));
  }
};
