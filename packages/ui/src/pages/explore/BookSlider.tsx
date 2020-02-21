import React, { useState } from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { Swipeable } from 'react-swipeable';
import { Front } from '@friends-library/cover-component';
import { Book } from './types';
import { useWindowWidth } from '../../hooks/window-width';
import { SCREEN_MD, SCREEN_LG, SCREEN_XL } from '../../lib/constants';
import './BookSlider.css';

interface Props {
  books: Book[];
  className?: string;
}

const BookSlider: React.FC<Props> = ({ books, className }) => {
  const winWidth = useWindowWidth();
  const [numPages, booksPerPage] = getNumPages(books.length, winWidth);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const canGoRight = numPages > 0 && currentPage < numPages;
  const canGoLeft = numPages > 0 && currentPage > 1;

  return (
    <Swipeable
      onSwipedRight={() =>
        winWidth >= SCREEN_MD && canGoLeft && setCurrentPage(currentPage - 1)
      }
      onSwipedLeft={() =>
        winWidth >= SCREEN_MD && canGoRight && setCurrentPage(currentPage + 1)
      }
      className={cx(className, 'BookSlider md:overflow-hidden relative')}
    >
      {canGoLeft && (
        <Arrow direction="left" onClick={() => setCurrentPage(currentPage - 1)} />
      )}
      {canGoRight && (
        <Arrow direction="right" onClick={() => setCurrentPage(currentPage + 1)} />
      )}
      <div
        style={{
          transform: `translateX(-${(currentPage - 1) *
            WIDTH_OF_BOOK_DIV *
            booksPerPage}px`,
        }}
        className="BookSlider__viewport md:flex transition-all duration-500 ease-in-out"
      >
        {books.map(book => (
          <div
            key={book.documentUrl}
            className={cx(
              'BookSlider__Book max-w-xs flex flex-col items-center mb-12 px-10 text-center',
              'md:px-6 md:mb-0',
            )}
          >
            <Front {...book} className="" size="m" scaler={1 / 4} scope="1-4" shadow />
            <h3 className="my-4 tracking-wider text-base text-flgray-900 md:mb-2 md:pb-1">
              {book.title}
            </h3>
            <Link to={book.authorUrl} className="fl-underline text-sm text-flprimary">
              {book.author}
            </Link>
          </div>
        ))}
      </div>
      {numPages > 1 && (
        <div className="hidden md:flex justify-center pt-4">
          {Array.from({ length: numPages }).map((_, idx) => (
            <b
              key={`page-${idx + 1}`}
              onClick={() => setCurrentPage(idx + 1)}
              className={cx(
                'px-2 text-3xl',
                currentPage === idx + 1 && 'text-flgray-600',
                currentPage !== idx + 1 && 'text-flgray-400 cursor-pointer',
              )}
            >
              •
            </b>
          ))}
        </div>
      )}
    </Swipeable>
  );
};

export default BookSlider;

const Arrow: React.FC<{ direction: 'left' | 'right'; onClick: () => any }> = ({
  direction,
  onClick,
}) => (
  <i
    onClick={onClick}
    className={cx(
      `fa-chevron-${direction} hidden md:inline`,
      'fa z-50 cursor-pointer hover:text-black',
      'fa absolute text-2xl text-gray-700 px-4 opacity-25 cursor-pointer',
      'transform -translate-y-1/2',
    )}
  />
);

function getNumPages(numBooks: number, winWidth: number): [number, number] {
  if (winWidth < 0) {
    return [0, 500];
  }
  let booksPerPage = 3;
  if (winWidth > SCREEN_LG) {
    booksPerPage = 4;
  }
  if (winWidth > SCREEN_XL) {
    booksPerPage = 5;
  }
  if (winWidth > SCREEN_2XL) {
    booksPerPage = 6;
  }
  return [Math.ceil(numBooks / booksPerPage), booksPerPage];
}

const WIDTH_OF_BOOK_DIV = 224;
const SCREEN_2XL = SCREEN_XL + WIDTH_OF_BOOK_DIV;
