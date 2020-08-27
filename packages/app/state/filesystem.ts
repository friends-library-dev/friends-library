import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';
import * as keys from '../lib/keys';
import { Thunk } from '.';
import Service from '../lib/service';
import FS from '../lib/fs';

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
    completeDownload: (state, action: PayloadAction<string>) => {
      const path = action.payload;
      if (state[path]) return state;
      state[path].bytesOnDisk = state[path].totalBytes;
    },
    resetDownload: (state, action: PayloadAction<string>) => {
      const path = action.payload;
      if (state[path]) return state;
      state[path].bytesOnDisk = 0;
    },
    batchSet: (state, action: PayloadAction<FilesystemState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setBytesOnDisk: (
      state,
      action: PayloadAction<{ path: string; bytesOnDisk: number }>,
    ) => {
      const { path, bytesOnDisk } = action.payload;
      if (state[path]) return state;
      state[path].bytesOnDisk = bytesOnDisk;
    },
    setTotalBytes: (
      state,
      action: PayloadAction<{ path: string; totalBytes: number }>,
    ) => {
      const { path, totalBytes } = action.payload;
      if (state[path]) return state;
      state[path].totalBytes = totalBytes;
    },
    set: (state, action: PayloadAction<{ path: string; fileState: FileState }>) => {
      const { path, fileState } = action.payload;
      state[path] = fileState;
    },
  },
});

export const {
  batchSet,
  setUndownloadedAudios,
  set,
  setBytesOnDisk,
  setTotalBytes,
  completeDownload,
  resetDownload,
} = filesystemSlice.actions;
export default filesystemSlice.reducer;

export const downloadAudio = (
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): Thunk => async (dispatch, getState) => {
  const audio = getState().audioResources[audioId];
  const path = keys.audioFilePath(audioId, partIndex, quality);
  const url = audio.parts[partIndex][quality === `HQ` ? `url` : `urlLq`];
  return FS.eventedDownload(
    path,
    url,
    (totalBytes) => dispatch(setTotalBytes({ path, totalBytes })),
    (bytesWritten, totalBytes) =>
      dispatch(set({ path, fileState: { bytesOnDisk: bytesWritten, totalBytes } })),
    (success) => dispatch(success ? completeDownload(path) : resetDownload(path)),
  );
};

export const downloadFile = (path: string, url: string): Thunk => async (dispatch) => {
  const bytes = await Service.downloadFile(path, url);
  if (bytes) {
    dispatch(set({ path, fileState: { totalBytes: bytes, bytesOnDisk: bytes } }));
  }
};

export function isDownloaded({ bytesOnDisk, totalBytes }: FileState): boolean {
  return bytesOnDisk === totalBytes;
}

export function isDownloading({ bytesOnDisk, totalBytes }: FileState): boolean {
  return bytesOnDisk > 0 && bytesOnDisk < totalBytes;
}

export function downloadProgress({ bytesOnDisk, totalBytes }: FileState): number {
  return (bytesOnDisk / totalBytes) * 100;
}
