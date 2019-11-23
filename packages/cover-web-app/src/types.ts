import {
  Lang,
  Name,
  PrintSize,
  Description,
  EditionType,
  ISBN,
  Html,
  Css,
} from '@friends-library/types';

export interface EditionData {
  id: string;
  type: EditionType;
  pages: number;
  size: PrintSize;
  isbn: ISBN;
}

export interface DocumentData {
  lang: Lang;
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
