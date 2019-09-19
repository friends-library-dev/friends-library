import React from 'react';
import cx from 'classnames';
import { FeaturedBook } from './FeaturedBooks';
import Button from '../Button';

const Book: React.FC<{ isCurrent: boolean; book: FeaturedBook }> = ({
  isCurrent,
  book,
}) => {
  return (
    <div
      className={cx(
        'Book px-8 sm:px-12 md:px-16 flex flex-col md:flex-row w-screen',
        isCurrent && 'order-first',
      )}
    >
      <div className="md:w-2/5 md:mr-16">
        <img
          className="shadow-xl w-2/5 md:w-100 lg:w-4/5 xl:w-3/5 mx-auto mb-8 md:mb-12 md:w-auto"
          src={book.cover}
          alt="Paperback cover"
        />
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
          to={`/${book.friendSlug}/${book.docSlug}`}
          className="bg-flblue mt-auto sm:mt-8 sm:mt-12 mx-auto md:mx-0"
        >
          Download &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Book;
