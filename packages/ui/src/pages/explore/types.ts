import { CoverProps } from '@friends-library/types';

export type Region =
  | 'Eastern US'
  | 'Western US'
  | 'England'
  | 'Scotland'
  | 'Ireland'
  | 'Other';

export type Book = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  htmlShortTitle: string;
  documentUrl: string;
  authorUrl: string;
};
