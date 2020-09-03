import { AudioQuality } from '@friends-library/types';

export function part(audioId: string, partIndex: number): string {
  return `${audioId}--${partIndex}`;
}

export function partWithQuality(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): string {
  return `${part(audioId, partIndex)}--${quality}`;
}

export function audioFilePath(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): string {
  return `audio/${partWithQuality(audioId, partIndex, quality)}.mp3`;
}

export function artworkFilePath(audioId: string): string {
  return `artwork/${audioId}.png`;
}
