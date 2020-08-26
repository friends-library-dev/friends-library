import { AudioQuality } from '@friends-library/types';

export function partWithQuality(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): string {
  return `${audioId}--${partIndex}--${quality}`;
}

export function audioFilePath(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): string {
  return `audio/${partWithQuality(audioId, partIndex, quality)}.mp3`;
}
