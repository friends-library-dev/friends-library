import {
  Name,
  PrintSizeAbbrev,
  Description,
  EditionType,
  ISBN,
} from '@friends-library/types';

export interface CoverProps {
  title: string;
  author: Name;
  printSize: PrintSizeAbbrev;
  pages: number;
  edition: EditionType | 'spanish';
  isbn?: ISBN;
  blurb: string;
  showGuides: boolean;
}

export type FriendData = {
  name: Name;
  description: Description;
  documents: {
    title: string;
    description: Description;
    editions: {
      type: EditionType | 'spanish';
      pages: Record<PrintSizeAbbrev, number>;
      defaultSize: PrintSizeAbbrev;
    }[];
  }[];
}[];
