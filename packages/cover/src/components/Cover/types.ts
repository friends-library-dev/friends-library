import { Name, PrintSizeAbbrev, Description, EditionType } from '@friends-library/types';

export interface EditionData {
  type: EditionType | 'spanish';
  pages: Record<PrintSizeAbbrev, number>;
  defaultSize: PrintSizeAbbrev;
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
