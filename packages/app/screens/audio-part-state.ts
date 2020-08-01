import { AudioPart } from 'types';
import { AudioQuality } from '@friends-library/types';
import FS from '../lib/FileSystem';

export interface PartState {
  downloading: boolean;
  progress: number;
  downloaded: boolean;
}

export type PartAction =
  | { type: 'SET_PROGRESS'; idx: number; progress: number }
  | { type: 'SET_DOWNLOADING'; idx: number; downloading: boolean }
  | { type: 'SET_DOWNLOADED'; idx: number; downloaded: boolean };

export function partsReducer(state: PartState[], action: PartAction): PartState[] {
  const part = state[action.idx];
  switch (action.type) {
    case `SET_DOWNLOADED`:
      part.downloaded = action.downloaded;
      break;
    case `SET_DOWNLOADING`:
      part.downloading = action.downloading;
      break;
    case `SET_PROGRESS`:
      part.progress = action.progress;
      break;
  }
  state = [...state];
  state[action.idx] = { ...part };
  return state;
}

export function initialPartsState(
  parts: AudioPart[],
  quality: AudioQuality,
): PartState[] {
  return parts.map((part) => ({
    downloading: false,
    progress: 0,
    downloaded: FS.hasAudio(part, quality),
  }));
}
