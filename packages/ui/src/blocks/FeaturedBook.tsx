import React from 'react';
import cx from 'classnames';
import { ThreeD as Front } from '@friends-library/cover-component';
import { FeaturedBook } from './FeaturedBooks';
import Button from '../Button';
import { Lang } from '@friends-library/types';

const Book: React.FC<{ isCurrent: boolean; book: FeaturedBook }> = ({
  isCurrent,
  book,
}) => {
  const coverProps = {
    lang: 'en' as Lang,
    edition: book.edition,
    isCompilation: false,
    author: book.friendName,
    title: book.title,
    isbn: '',
    blurb: '',
    pages: 222,
    customCss: '',
    customHtml: '',
    perspective: 'angle-front' as const,
  };
  return (
    <div
      className={cx(
        'Book px-8 sm:px-12 md:px-16 flex flex-col md:flex-row w-screen',
        isCurrent && 'order-first',
      )}
    >
      <div className="flex flex-col items-center md:items-end md:w-2/5 md:mr-16">
        <div className="mb-8 md:hidden">
          <Front {...coverProps} size="m" scope="1-2" scaler={1 / 2} />
        </div>
        <div className="hidden md:block">
          <Front {...coverProps} size="m" scope="3-5" scaler={3 / 5} />
        </div>
      </div>
      <div className="Text md:w-3/5 flex-grow flex flex-col justify-start">
        <h2 className="font-sans text-gray-800 text-2xl mb-4 md:mb-6 leading-relaxed tracking-wider font-bold">
          {book.title}
        </h2>
        <p className="hidden sm:block font-sans uppercase text-gray-800 text-lg tracking-widest font-black mb-6">
          Modernized Edition
        </p>
        <p className="font-serif text-lg md:text-xl opacity-75 leading-relaxed max-w-2xl">
          {book.description}
        </p>
        <p className="mb-10 md:mb-0 my-6">
          <em className="font-serif font-black text-lg antialiased pr-2">by:</em>{' '}
          <a
            href={`/friend/${book.friendSlug}`}
            className="font-serif uppercase text-lg antialiased font-bold text-flblue bracketed"
          >
            {book.friendName}
          </a>
        </p>
        <Button
          bg="blue"
          to={`/${book.friendSlug}/${book.docSlug}`}
          className="mt-auto sm:mt-8 sm:mt-12 mx-auto md:mx-0"
        >
          Download &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Book;
