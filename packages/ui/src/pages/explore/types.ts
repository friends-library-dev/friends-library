import { CoverProps } from '@friends-library/types';

export type Region = 'Northern US' | 'Southern US' | 'England' | 'Scotland' | 'Ireland';

export type Book = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  documentUrl: string;
  authorUrl: string;
};
