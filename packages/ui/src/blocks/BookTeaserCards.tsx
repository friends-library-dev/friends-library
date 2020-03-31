import React from 'react';
import cx from 'classnames';
import BookTeaserCard, { Props as BookTeaserCardProps } from '../BookTeaserCard';

interface Props {
  className?: string;
  id?: string;
  title: string;
  titleEl: 'h1' | 'h2' | 'h3' | 'h4';
  bgColor: string;
  titleTextColor: string;
  books: BookTeaserCardProps[];
}

const BookTeaserCards: React.FC<Props> = ({
  id,
  className,
  title,
  bgColor,
  titleTextColor,
  books,
  titleEl: TitleEl,
}) => {
  if (books.length === 0) return null;
  return (
    <section
      id={id}
      className={cx(
        className,
        `bg-${bgColor}`,
        'BookTeaserCards pb-16',
        'md:pt-16 md:pb-1',
        'xl:flex xl:flex-wrap xl:justify-center',
      )}
    >
      <TitleEl
        className={cx(
          `text-${titleTextColor}`,
          'sans-wider px-6 text-2xl text-center mt-10 md:-mt-2 md:mb-12 xl:w-full',
        )}
      >
        {title}
      </TitleEl>
      {books.map(book => (
        <BookTeaserCard
          className="pt-16 md:pt-0 md:mb-16 xl:mx-6"
          key={book.documentUrl}
          {...book}
        />
      ))}
    </section>
  );
};

export default BookTeaserCards;
