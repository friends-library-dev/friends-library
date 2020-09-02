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
  'All Audiobooks': undefined;
  Audio: { audioId: string };
  Settings: undefined;
};
