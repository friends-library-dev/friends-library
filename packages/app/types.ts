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

export type StackParamList = {
  Home: undefined;
  Audiobooks: undefined;
  Listen: { audioId: string };
  Settings: undefined;
};

export interface TrackData {
  id: string;
  filepath: string;
  title: string;
  artist: string;
  artworkUrl: string;
  duration: number;
}
