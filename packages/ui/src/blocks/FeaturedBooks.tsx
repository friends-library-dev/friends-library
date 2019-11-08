import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import Heading from '../Heading';
import SFCover from '../images/samuel-fothergill-cover.jpg';
import FeaturedBook from './FeaturedBook';
import './FeaturedBooks.css';

const FeaturedBooks: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [controlled, setControlled] = useState<boolean>(false);

  useEffect(() => {
    if (controlled) return;
    setTimeout(() => {
      setIndex(index === FEATURED_BOOKS.length - 1 ? 0 : index + 1);
    }, 6500);
  });

  return (
    <section className="FeaturedBooks py-10 sm:py-12 md:py-20">
      <Heading className="text-gray-800">Featured Books</Heading>
      <div className="BooksViewer overflow-hidden">
        <div className="BookWrap flex">
          {FEATURED_BOOKS.map((book, bkIdx) => (
            <FeaturedBook key={book.title} book={book} isCurrent={bkIdx === index} />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        {FEATURED_BOOKS.map((book, bkIdx) => (
          <i
            key={book.title}
            onClick={() => {
              setControlled(true);
              setIndex(bkIdx);
            }}
            className={cx('block w-2 h-2 mx-2 rounded-full', {
              'bg-gray-700': index === bkIdx,
              'bg-gray-400': index !== bkIdx,
            })}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedBooks;

// @TODO vary by LANG, possibly pull in data dynamically from friends/*.yml
const FEATURED_BOOKS = [
  {
    title: 'The Life and Letters of Samuel Fothergill',
    friendSlug: 'samuel-fothergill',
    friendName: 'Samuel Fothergill',
    cover: SFCover,
    docSlug: 'life-letters',
    description:
      'Samuel Fothergill was one of the most eminent ministers in the history of the Society of Friends, greatly loved and esteemed for the humility and purity of his life, as well as the authority and heart-tendering power of his ministry.',
  },
  {
    title: 'Walk in the Spirit',
    friendSlug: 'hugh-turford',
    friendName: 'Hugh Turford',
    cover:
      'https://friends-library-assets.nyc3.digitaloceanspaces.com/en/hugh-turford/walk-in-the-spirit/updated/Walk_in_the_Spirit--updated--cover.png',
    docSlug: 'walk-in-the-spirit',
    description:
      'This short work has long been treasured by Friends for the simplicity and clarity with which it describes the inward work of obedience and purification by the light and grace of the Holy Spirit working in the heart.',
  },
  {
    title: 'No Cross, No Crown',
    friendSlug: 'william-penn',
    friendName: 'Wiliam Penn',
    cover:
      'https://friends-library-assets.nyc3.digitaloceanspaces.com/en/william-penn/no-cross-no-crown/updated/No_Cross_No_Crown--updated--cover.png',
    docSlug: 'no-cross-no-crown',
    description:
      'In this classic treatise, William Penn clearly presents the nature, power, and experience of the daily cross of Christ, explaining what it is, where and how it is to be taken up, and the manner of its working in the true disciples of Christ.',
  },
];

export type FeaturedBook = typeof FEATURED_BOOKS[0];
