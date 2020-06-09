import React from 'react';
import { ThreeD } from '@friends-library/cover-component';
import { LANG } from '../env';
import { PrintSize, EditionType, ISBN, CoverProps } from '@friends-library/types';

export interface CoverData {
  title: string;
  author: string;
  isCompilation: boolean;
  editions: {
    size: PrintSize;
    type: EditionType;
    blurb: string;
    isbn: ISBN;
    pages: number[];
    code: {
      css: {
        cover: string | null;
      };
      html: {
        cover: string | null;
      };
    };
  }[];
}

export function coverPropsFromQueryData(data: CoverData): CoverProps {
  const { title, author, isCompilation, editions } = data;
  const edition = editions[0];
  return {
    lang: LANG,
    title,
    isCompilation,
    author,
    size: edition.size,
    pages: edition.pages[0],
    edition: edition.type,
    isbn: edition.isbn,
    blurb: edition.blurb,
    customCss: edition.code.css.cover || ``,
    customHtml: edition.code.html.cover || ``,
  };
}

export function cover3dFromQuery(
  data: CoverData,
  overrideProps?: Partial<CoverProps>,
): JSX.Element {
  const propsFromQuery = coverPropsFromQueryData(data);
  return <ThreeD {...propsFromQuery} {...overrideProps} />;
}
