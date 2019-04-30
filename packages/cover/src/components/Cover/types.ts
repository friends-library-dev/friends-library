import { Name, PrintSizeAbbrev, Description, EditionType } from '@friends-library/types';

export interface CoverProps {
  title: string;
  author: Name;
  printSize: PrintSizeAbbrev;
  pages: number;
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
