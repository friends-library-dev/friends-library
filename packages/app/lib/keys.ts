import { AudioQuality } from '@friends-library/types';

export function partWithQuality(
  audioId: string,
  partIndex: number,
  quality: AudioQuality,
): string {
  return `${audioId}--${partIndex}--${quality}`;
}
