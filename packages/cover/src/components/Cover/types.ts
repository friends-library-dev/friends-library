import {
  Name,
  PrintSizeAbbrev,
  Description,
  EditionType,
  ISBN,
  Html,
  Css,
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
  customHtml: Html | null;
  customCss: Css | null;
}

export interface FriendData {
  name: Name;
  description: Description;
  documents: DocumentData[];
}
