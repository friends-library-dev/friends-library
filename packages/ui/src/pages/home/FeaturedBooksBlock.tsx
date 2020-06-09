import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Swipeable } from 'react-swipeable';
import { CoverProps } from '@friends-library/types';
import { t } from '@friends-library/locale';
import Heading from '../../Heading';
import FeaturedBook from './FeaturedBook';
import './FeaturedBooksBlock.css';

export type FeaturedBookProps = CoverProps & {
  featuredDesc: string;
  documentUrl: string;
  authorUrl: string;
  htmlShortTitle: string;
};

interface Props {
  books: FeaturedBookProps[];
}

const FeaturedBooksBlock: React.FC<Props> = ({ books }) => {
  const [index, setIndex] = useState<number>(0);
  const [controlled, setControlled] = useState<boolean>(false);

  useEffect(() => {
    if (controlled) return;
    const timeout = setTimeout(() => {
      setIndex(index === books.length - 1 ? 0 : index + 1);
    }, 6500);
    return () => clearTimeout(timeout);
  });

  return (
    <Swipeable
      nodeName="section"
      className="FeaturedBooksBlock py-10 sm:py-12 md:py-20"
      onSwipedRight={() => {
        setControlled(true);
        setIndex(index === 0 ? books.length - 1 : index - 1);
      }}
      onSwipedLeft={() => {
        setControlled(true);
        setIndex(index === books.length - 1 ? 0 : index + 1);
      }}
    >
      <Heading className="text-gray-800">{t`Featured Books`}</Heading>
      <div className="BooksViewer overflow-hidden">
        <div className="BookWrap flex">
          {books.map((book, bkIdx) => (
            <FeaturedBook key={book.title} {...book} isCurrent={bkIdx === index} />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        {books.map((book, bkIdx) => (
          <i
            key={book.title}
            onClick={() => {
              setControlled(true);
              setIndex(bkIdx);
            }}
            className={cx(`block w-2 h-2 mx-2 rounded-full`, {
              'bg-gray-700': index === bkIdx,
              'bg-gray-400': index !== bkIdx,
            })}
          />
        ))}
      </div>
    </Swipeable>
  );
};

export default FeaturedBooksBlock;
