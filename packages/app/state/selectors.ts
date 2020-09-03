import { isNotNull } from '@friends-library/types';
import { State } from './';
import FS from '../lib/fs';
import * as keys from '../lib/keys';
import { TrackData, AudioResource, AudioPart } from '../types';
import { FileState } from './filesystem';

export function isAudioPartPlaying(
  audioId: string,
  partIndex: number,
  state: State,
): boolean {
  return (
    isAudioPlaying(audioId, state) && partIndex === audioActivePartIndex(audioId, state)
  );
}
export function isAudioPartPaused(
  audioId: string,
  partIndex: number,
  state: State,
): boolean {
  return (
    isAudioPaused(audioId, state) && partIndex === audioActivePartIndex(audioId, state)
  );
}

export function isAudioPartActive(
  audioId: string,
  partIndex: number,
  state: State,
): boolean {
  return partIndex === audioActivePartIndex(audioId, state);
}

export function audio(audioId: string, state: State): AudioResource | null {
  return state.audioResources[audioId] || null;
}

export function trackPosition(audioId: string, partIndex: number, state: State): number {
  const key = keys.part(audioId, partIndex);
  return state.trackPosition[key] ?? 0;
}

export function currentlyPlayingPart(state: State): null | [AudioPart, AudioResource] {
  const audioId = state.playback.audioId;
  if (!audioId) return null;
  return activeAudioPart(audioId, state);
}

export function audioPart(
  audioId: string,
  partIndex: number,
  state: State,
): null | [AudioPart, AudioResource] {
  const audioResource = audio(audioId, state);
  if (!audioResource) return null;
  const part = audioResource.parts[partIndex];
  if (!part) return null;
  return [part, audioResource];
}

export function activeAudioPart(
  audioId: string,
  state: State,
): null | [AudioPart, AudioResource] {
  return audioPart(audioId, audioActivePartIndex(audioId, state), state);
}

export function isAudioPaused(audioId: string, state: State): boolean {
  return isAudioSelected(audioId, state) && state.playback.state === `PAUSED`;
}

export function isAudioPlaying(audioId: string, state: State): boolean {
  return isAudioSelected(audioId, state) && state.playback.state === `PLAYING`;
}

export function isAudioSelected(audioId: string, state: State): boolean {
  return state.playback.audioId === audioId;
}

export function audioActivePartIndex(audioId: string, state: State): number {
  return state.activePart[audioId] ?? 0;
}

export function audioFiles(audioId: string, state: State): null | FileState[] {
  const audioResource = audio(audioId, state);
  if (!audioResource) return null;
  return audioResource.parts.map((part, index) => audioPartFile(audioId, index, state));
}

export function audioPartFile(
  audioId: string,
  partIndex: number,
  state: State,
): FileState {
  const quality = state.preferences.audioQuality;
  const audioPath = keys.audioFilePath(audioId, partIndex, quality);
  const audio = state.audioResources[audioId];
  let fallbackSize = 10000;
  if (audio && audio.parts[partIndex]) {
    fallbackSize = audio.parts[partIndex][quality === `HQ` ? `size` : `sizeLq`];
  }
  return (
    state.filesystem[audioPath] || {
      totalBytes: fallbackSize,
      bytesOnDisk: 0,
    }
  );
}

export function artwork(
  audioId: string,
  { filesystem, audioResources }: State,
): { path: string; uri: string; networkUrl: string; downloaded: boolean } | null {
  const path = keys.artworkFilePath(audioId);
  const audio = audioResources[audioId];
  if (!audio) return null;
  const networkUrl = audio.artwork;
  let uri = networkUrl;
  let downloaded = false;
  if (path in filesystem) {
    uri = `file://${FS.abspath(path)}`;
    downloaded = true;
  }
  return { path, uri, networkUrl, downloaded };
}

export function trackQueue(audioId: string, state: State): null | TrackData[] {
  const audioResource = audio(audioId, state);
  if (!audioResource) return null;
  const tracks = audioResource.parts
    .map((part) => trackData(audioId, part.index, state))
    .filter(isNotNull);
  return tracks.length > 0 ? tracks : null;
}

export function trackData(
  audioId: string,
  partIndex: number,
  state: State,
): TrackData | null {
  const { audioResources, preferences: prefs } = state;
  const audioPath = keys.audioFilePath(audioId, partIndex, prefs.audioQuality);
  const audio = audioResources[audioId];
  const artworkData = artwork(audioId, state);
  if (!audio || !artworkData) {
    return null;
  }
  const part = audio.parts[partIndex];

  return {
    id: keys.part(audioId, partIndex),
    filepath: `file://${FS.abspath(audioPath)}`,
    title: part.title,
    artist: audio.friend.startsWith(`Compila`) ? `Friends Library` : audio.friend,
    artworkUrl: artworkData.uri,
    duration: part.duration,
  };
}
