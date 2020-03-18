import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { Swipeable } from 'react-swipeable';
import { Front } from '@friends-library/cover-component';
import { Book } from './types';
import { useWindowWidth } from '../../hooks/window-width';
import { SCREEN_MD, SCREEN_LG, SCREEN_XL } from '../../lib/constants';
import Button from '../../Button';
import './BookSlider.css';

interface Props {
  books: Book[];
  className?: string;
}

const BookSlider: React.FC<Props> = ({ books, className }) => {
  const winWidth = useWindowWidth();
  const [numHorizPages, booksPerHorizPage] = horizPages(books.length, winWidth);
  const [currentHorizPage, setCurrentHorizPage] = useState<number>(1);
  const [vertCutoff, setVertCutoff] = useState<number>(4);
  const canGoRight = numHorizPages > 0 && currentHorizPage < numHorizPages;
  const canGoLeft = numHorizPages > 0 && currentHorizPage > 1;
  const notMobile = winWidth >= SCREEN_MD;

  // reset position when books are updated
  useEffect(() => {
    setCurrentHorizPage(1);
    setVertCutoff(4);
  }, [books]);

  return (
    <Swipeable
      onSwipedRight={() =>
        notMobile && canGoLeft && setCurrentHorizPage(currentHorizPage - 1)
      }
      onSwipedLeft={() =>
        notMobile && canGoRight && setCurrentHorizPage(currentHorizPage + 1)
      }
      className={cx(className, 'BookSlider md:overflow-hidden md:relative')}
    >
      {canGoLeft && (
        <Arrow
          direction="left"
          onClick={() => setCurrentHorizPage(currentHorizPage - 1)}
        />
      )}
      {canGoRight && (
        <Arrow
          direction="right"
          onClick={() => setCurrentHorizPage(currentHorizPage + 1)}
        />
      )}
      <div
        className="md:flex transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(-${viewportOffset(
            currentHorizPage,
            winWidth,
            booksPerHorizPage,
          )}px`,
        }}
      >
        {books.map((book, idx) => (
          <div
            key={book.documentUrl}
            className={cx(
              idx < vertCutoff ? 'flex' : 'hidden md:flex',
              'BookSlider__Book max-w-xs flex-col items-center mb-12 px-10 text-center',
              'md:px-6 md:mb-0',
            )}
          >
            <Link to={book.documentUrl}>
              <Front {...book} className="" size="m" scaler={1 / 4} scope="1-4" shadow />
            </Link>
            <h3 className="my-4 tracking-wider text-base text-flgray-900 md:mb-2 md:pb-1">
              {book.title}
            </h3>
            <Link to={book.authorUrl} className="fl-underline text-sm text-flprimary">
              {book.author}
            </Link>
          </div>
        ))}
      </div>
      {numHorizPages > 1 && (
        <div className="hidden md:flex justify-center pt-4">
          {Array.from({ length: numHorizPages }).map((_, idx) => (
            <b
              key={`page-${idx + 1}`}
              onClick={() => setCurrentHorizPage(idx + 1)}
              className={cx(
                'px-2 text-3xl',
                currentHorizPage === idx + 1 && 'text-flgray-600',
                currentHorizPage !== idx + 1 && 'text-flgray-400 cursor-pointer',
              )}
            >
              •
            </b>
          ))}
        </div>
      )}
      {vertCutoff < books.length && (
        <Button
          className="mx-auto md:hidden mb-6"
          onClick={() => setVertCutoff(vertCutoff + 4)}
        >
          Show more
        </Button>
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
      `fa-chevron-${direction}`,
      'fa z-50 cursor-pointer hover:text-black',
      'fa absolute text-2xl text-gray-700 px-4 opacity-25 cursor-pointer',
      'transform -translate-y-1/2',
    )}
  />
);

function horizPages(numBooks: number, winWidth: number): [number, number] {
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

function viewportOffset(
  currentHorizPage: number,
  winWidth: number,
  booksPerHorizPage: number,
): number {
  if (winWidth < SCREEN_MD) {
    return 0;
  }
  return (currentHorizPage - 1) * WIDTH_OF_BOOK_DIV * booksPerHorizPage;
}

const WIDTH_OF_BOOK_DIV = 224;
const SCREEN_2XL = SCREEN_XL + WIDTH_OF_BOOK_DIV;
