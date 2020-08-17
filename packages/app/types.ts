import { AudioQuality } from '@friends-library/types';

export interface PlayerState {
  playing: boolean;
  playbackState: 'NONE' | 'PLAYING' | 'PAUSED' | 'STOPPED' | 'READY' | 'BUFFERING';
  trackAudioId?: string;
  trackPartIndex?: number;
}

export interface AudioPart {
  audioId: string;
  index: number;
  title: string;
  duration: number;
  size: number;
  sizeLq: number;
  url: string;
  urlLq: string;
}

export interface AudioResource {
  id: string;
  date: string;
  title: string;
  friend: string;
  reader: string;
  artwork: string;
  description: string;
  shortDescription: string;
  parts: AudioPart[];
}

export interface UserSettings {
  audioQuality: AudioQuality;
}

export interface ResumeState {
  lastPlayedAudio: string | null;
  lastPlayedPart: {
    [audioId: string]: number;
  };
  partPositions: {
    [partId: string]: number;
  };
}

export type StackParamList = {
  Home: undefined;
  'All Audiobooks': undefined;
  Audio: { audio: AudioResource };
  Settings: undefined;
};
