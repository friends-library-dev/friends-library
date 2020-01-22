import {
  Gender,
  Lang,
  Slug,
  Name,
  Description,
  Uuid,
  EditionType,
  ISBN,
} from '@friends-library/types';

export interface FriendData {
  id: Uuid;
  lang: Lang;
  name: Name;
  slug: Slug;
  gender: Gender;
  description: Description;
  documents: DocumentData[];
  residences: {
    city: string;
    country: string;
    durations: {
      start: number;
      end: number;
    }[];
  }[];
}

export interface DocumentData {
  id: Uuid;
  title: string;
  slug: Slug;
  filename: string;
  description: Description;
  tags: (
    | 'journal'
    | 'letters'
    | 'exhortation'
    | 'doctrinal'
    | 'treatise'
    | 'history'
    | 'allegory'
    | 'devotional'
  )[];
  original_title?: string;
  published?: number;
  editions: EditionData[];
  alt_language_id?: Uuid;
}

export interface EditionData {
  type: EditionType;
  editor?: Name;
  splits?: number[];
  isbn: ISBN;
  description?: string;
  audio?: AudioData;
  draft?: true;
}

export interface AudioData {
  reader: Name;
  external_playlist_id_lq?: number;
  external_playlist_id_hq?: number;
  parts: AudioPartData[];
}

export interface AudioPartData {
  title: string;
  external_id_lq: number;
  external_id_hq: number;
  filesize_lq: number;
  filesize_hq: number;
  seconds: number;
  chapters: number[];
}
