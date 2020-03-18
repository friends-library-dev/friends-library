import React from 'react';
import cx from 'classnames';
import { t } from '../../translation';
import BookTeaserCard, { Props as BookTeaserCardProps } from '../../BookTeaserCard';

interface Props {
  books: BookTeaserCardProps[];
}

const NewBooksBlock: React.FC<Props> = ({ books }) => (
  <div
    id="NewBooksBlock"
    className={cx(
      'NewBooksBlock bg-flblue pb-16',
      'md:pt-16 md:pb-1',
      'xl:flex xl:flex-wrap xl:justify-center',
    )}
  >
    <h2 className="text-white sans-wider text-2xl text-center mt-10 md:-mt-2 md:mb-12 xl:w-full">
      {t`Recently Added Books`}
    </h2>
    {books.map(book => (
      <BookTeaserCard
        className="pt-16 md:pt-0 md:mb-16 xl:mx-6"
        key={book.documentUrl}
        {...book}
      />
    ))}
  </div>
);

export default NewBooksBlock;
