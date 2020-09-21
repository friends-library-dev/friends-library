import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import pLimit from 'p-limit';
import { AudioQuality } from '@friends-library/types';
import * as keys from '../lib/keys';
import { Thunk, Dispatch, State } from '.';
import Service from '../lib/service';
import FS from '../lib/fs';
import * as select from '../state/selectors';
import { canDownloadNow } from '../state/network';

export interface FileState {
  totalBytes: number;
  bytesOnDisk: number;
  queued?: boolean;
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
    setQueued: (state, action: PayloadAction<{ path: string; queued: boolean }>) => {
      const { path, queued } = action.payload;
      const file = state[path];
      if (!file) {
        state[path] = { totalBytes: 0, bytesOnDisk: ERROR_FALLBACK_SIZE, queued };
        return;
      }
      file.queued = queued;
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
  setQueued,
  setBytesOnDisk,
  setTotalBytes,
  completeDownload,
  resetDownload,
} = filesystemSlice.actions;
export default filesystemSlice.reducer;

export const deleteAllAudios = (): Thunk => async (dispatch, getState) => {
  const filesystem = getState().filesystem;
  const deleted = Object.keys(filesystem).reduce((acc, path) => {
    const file = filesystem[path];
    if (file && path.endsWith(`.mp3`)) {
      acc[path] = { totalBytes: file.totalBytes, bytesOnDisk: 0 };
    }
    return acc;
  }, {} as FilesystemState);
  dispatch(batchSet(deleted));
  Service.fsDeleteAllAudios();
};

export const deleteAllAudioParts = (audioId: string): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const filesystem = state.filesystem;
  const audio = select.audio(audioId, state);
  if (!audio) return;
  const deletedFiles: FilesystemState = {};
  audio.parts.forEach((part, idx) => {
    ([`HQ`, `LQ`] as const).forEach((quality) => {
      const path = keys.audioFilePath(audioId, idx, quality);
      const file = filesystem[path];
      deletedFiles[path] = {
        totalBytes: file ? file.totalBytes : ERROR_FALLBACK_SIZE,
        bytesOnDisk: 0,
        queued: false,
      };
    });
  });
  dispatch(batchSet(deletedFiles));
  Service.fsBatchDelete(Object.keys(deletedFiles));
};

const limit = pLimit(3);

export const downloadAllAudios = (audioId: string): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const parts = select.audioFiles(audioId, state);
  const quality = state.preferences.audioQuality;

  if (!parts || !canDownloadNow(state, dispatch)) {
    return;
  }
  const downloadIndexes = parts
    .map((part, index) => ({ part, partIndex: index }))
    .filter(({ part }) => !isDownloaded(part) && !isDownloading(part))
    .map(({ partIndex }) => partIndex);

  downloadIndexes.forEach((partIndex) => {
    const path = keys.audioFilePath(audioId, partIndex, quality);
    dispatch(setQueued({ path, queued: true }));
  });

  const batchedPromises = downloadIndexes.map((partIndex) =>
    limit(() => execDownloadAudio(audioId, partIndex, dispatch, state)),
  );

  return Promise.all(batchedPromises);
};

export const downloadAudio = (audioId: string, partIndex: number): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  if (!canDownloadNow(state, dispatch)) return;
  return execDownloadAudio(audioId, partIndex, dispatch, state);
};

export const maybeDownloadNextQueuedTrack = (position: number): Thunk => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const current = select.currentlyPlayingPart(state);
  if (!current || !state.network.connected) {
    return;
  }

  const [part, audio] = current;
  if (audio.parts.length === 1 || part.index === audio.parts.length - 1) {
    return; // no next track to download
  }

  const nextPart = audio.parts[part.index + 1];
  if (!nextPart) {
    return;
  }

  // only pre-download when they've hit 75% of current track
  if (position / part.duration < 0.75) {
    return;
  }

  const nextFile = select.audioPartFile(audio.id, nextPart.index, state);
  if (!isDownloaded(nextFile) && !isDownloading(nextFile)) {
    execDownloadAudio(audio.id, nextPart.index, dispatch, state);
  }
};

function execDownloadAudio(
  audioId: string,
  partIndex: number,
  dispatch: Dispatch,
  state: State,
): Promise<void> {
  const quality = state.preferences.audioQuality;
  const audio = state.audioResources[audioId];
  if (!audio) return Promise.resolve();
  const path = keys.audioFilePath(audioId, partIndex, quality);
  const url = audio.parts[partIndex][quality === `HQ` ? `url` : `urlLq`];
  return FS.eventedDownload(
    path,
    url,
    (totalBytes) => {
      dispatch(set({ path, fileState: { bytesOnDisk: 1, totalBytes } }));
      dispatch(setQueued({ path, queued: false }));
    },
    (bytesWritten, totalBytes) =>
      dispatch(set({ path, fileState: { bytesOnDisk: bytesWritten, totalBytes } })),
    (success) => dispatch(success ? completeDownload(path) : resetDownload(path)),
  );
}

export const downloadFile = (path: string, url: string): Thunk => async (
  dispatch,
  getState,
) => {
  const { network } = getState();
  if (!network.connected) return;
  const bytes = await Service.fsDownloadFile(path, url);
  if (bytes) {
    dispatch(set({ path, fileState: { totalBytes: bytes, bytesOnDisk: bytes } }));
  }
};

export function isQueued({ queued }: FileState): boolean {
  return queued === true;
}

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
