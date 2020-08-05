export type StackParamList = {
  Home: undefined;
  'All Audiobooks': undefined;
  Audio: undefined;
  Settings: undefined;
};

export interface AudioResource {
  id: string;
  date: string;
  title: string;
  friend: string;
  reader: string;
  artwork: string;
  description: string;
  shortDescription: string;
  parts: {
    title: string;
    duration: number;
    size: number;
    sizeLq: number;
    url: number;
    urlLq: number;
  }[];
}
