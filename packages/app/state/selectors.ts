import { AudioQuality } from '@friends-library/types';
import { State } from './';
import FS from '../lib/fs';
import * as keys from '../lib/keys';
import { TrackData } from '../types';

export function artwork(
  audioId: string,
  { filesystem, audioResources }: State,
): { path: string; uri: string; networkUrl: string; downloaded: boolean } {
  const path = keys.artworkFilePath(audioId);
  const audio = audioResources[audioId];
  const networkUrl = audio.artwork;
  let uri = networkUrl;
  let downloaded = false;
  if (path in filesystem) {
    uri = `file://${FS.abspath(path)}`;
    downloaded = true;
  }
  return { path, uri, networkUrl, downloaded };
}

export function trackData(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
  state: State,
): TrackData {
  const { audioResources } = state;
  const audioPath = keys.audioFilePath(audioId, partIndex, quality);
  const audio = audioResources[audioId];
  const { uri: artworkUri } = artwork(audioId, state);
  const part = audio.parts[partIndex];

  console.log({ filepath: `file://${FS.abspath(audioPath)}` });
  return {
    id: keys.part(audioId, partIndex),
    filepath: `file://${FS.abspath(audioPath)}`,
    title: part.title,
    artist: audio.friend,
    artworkUrl: artworkUri,
    duration: part.duration,
  };
}
