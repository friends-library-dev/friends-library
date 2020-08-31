import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { AudioQuality } from '@friends-library/types';
import * as keys from '../lib/keys';
import { Thunk } from '.';
import Service from '../lib/service';
import FS from '../lib/fs';

export interface FileState {
  totalBytes: number;
  bytesOnDisk: number;
}

export type FilesystemState = Record<string, FileState | undefined>;

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
    completeDownload: (state, { payload: path }: PayloadAction<string>) => {
      const file = state[path];
      if (!file) {
        state[path] = {
          bytesOnDisk: ERROR_FALLBACK_SIZE,
          totalBytes: ERROR_FALLBACK_SIZE,
        };
        return;
      }
      file.bytesOnDisk = file.totalBytes;
    },
    resetDownload: (state, { payload: path }: PayloadAction<string>) => {
      const file = state[path];
      if (!file) {
        state[path] = { bytesOnDisk: 0, totalBytes: ERROR_FALLBACK_SIZE };
        return;
      }
      file.bytesOnDisk = 0;
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
      const file = state[path];
      if (!file) {
        state[path] = { bytesOnDisk, totalBytes: ERROR_FALLBACK_SIZE };
        return;
      }
      file.bytesOnDisk = bytesOnDisk;
    },
    setTotalBytes: (
      state,
      action: PayloadAction<{ path: string; totalBytes: number }>,
    ) => {
      const { path, totalBytes } = action.payload;
      const file = state[path];
      if (!file) {
        state[path] = { totalBytes, bytesOnDisk: 0 };
        return;
      }
      file.totalBytes = totalBytes;
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
  if (!audio) return Promise.resolve();
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

const ERROR_FALLBACK_SIZE = 10000;
