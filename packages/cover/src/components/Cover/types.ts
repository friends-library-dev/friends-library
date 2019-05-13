import {
  Name,
  PrintSizeAbbrev,
  Description,
  EditionType,
  ISBN,
} from '@friends-library/types';

export interface EditionData {
  type: EditionType | 'spanish';
  pages: Record<PrintSizeAbbrev, number>;
  defaultSize: PrintSizeAbbrev;
  isbn?: ISBN;
}

export interface DocumentData {
  title: string;
  description: Description;
  editions: EditionData[];
}

export interface FriendData {
  name: Name;
  description: Description;
  documents: DocumentData[];
}
