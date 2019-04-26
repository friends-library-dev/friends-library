import { Name, PrintSizeAbbrev } from '@friends-library/types';

export interface CoverProps {
  title: string;
  author: Name;
  printSize: PrintSizeAbbrev;
  pages: number;
}
