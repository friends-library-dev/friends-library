import React from 'react';
import { Front } from '@friends-library/cover-component';
import Link from 'gatsby-link';
import cx from 'classnames';
import { Book } from './types';
import './AudioBooksBlock.css';
import Button from '../../Button';

interface Props {
  books: Omit<Book, 'authorUrl'>[];
}

const AudioBooksBlock: React.FC<Props> = ({ books }) => (
  <div id="AudioBooksBlock" className="AudioBooksBlock text-center pb-16">
    <div className="AudioBooksBlock__Hero p-10 pb-56 md:pb-64">
      <h2 className="font-sans text-3xl tracking-wider text-white mb-6">Audio Books</h2>
      <p className="body-text text-white text-lg">
        We currently have {books.length} titles recorded as audiobooks.
      </p>
    </div>
    <div
      className={cx(
        '-mt-16 mx-16 flex flex-col items-center',
        'md:flex-row md:items-start md:flex-wrap md:justify-center md:content-center',
        'lg:mx-8',
      )}
    >
      {books.slice(0, 4).map(book => (
        <Link
          to={`${book.documentUrl}#ListenBlock`}
          className={cx(
            'flex flex-col items-center mb-10',
            'md:w-64 md:mx-12',
            'lg:mx-4 lg:w-56',
          )}
          key={book.documentUrl}
        >
          <div className="Album box-content shadow-xl mb-8">
            <Front {...book} className="" size="m" scaler={1 / 3} scope="1-3" />
          </div>
          <h4 className="font-sans text-flgray-900 text-base tracking-wider">
            {book.title}
          </h4>
        </Link>
      ))}
    </div>
    <Button className="mx-auto mt-12 md:mt-6" to="/audiobooks">
      View {books.length - 4} More &rarr;
    </Button>
  </div>
);

export default AudioBooksBlock;
