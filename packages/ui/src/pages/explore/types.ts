import { CoverProps } from '@friends-library/types';

export type Book = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  documentUrl: string;
  authorUrl: string;
};
