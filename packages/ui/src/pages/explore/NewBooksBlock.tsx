import React from 'react';
import cx from 'classnames';
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
