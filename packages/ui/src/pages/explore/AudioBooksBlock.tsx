import React from 'react';
import Link from 'gatsby-link';
import { FluidBgImageObject } from '@friends-library/types';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { Book } from './types';
import AudiobooksHero from '../../blocks/AudiobooksHero';
import Button from '../../Button';
import Album from '../../Album';
import './AudioBooksBlock.css';

interface Props {
  books: Omit<Book, 'authorUrl'>[];
  bgImg: FluidBgImageObject;
}

const AudioBooksBlock: React.FC<Props> = ({ books, bgImg }) => (
  <div id="AudioBooksBlock" className="AudioBooksBlock text-center pb-16">
    <AudiobooksHero
      bgImg={bgImg}
      className="p-10 pb-56 md:pb-64"
      numBooks={books.length}
    />
    <div
      className={cx(
        '-mt-16 mx-16 flex flex-col items-center',
        'md:flex-row md:items-start md:flex-wrap md:justify-center md:content-center',
        'lg:mx-8',
      )}
    >
      {books.slice(0, 4).map(book => (
        <Link
          to={`${book.documentUrl}#audiobook`}
          className={cx(
            'flex flex-col items-center mb-10',
            'md:w-64 md:mx-12',
            'lg:mx-4 lg:w-56',
          )}
          key={book.documentUrl}
        >
          <Album className="mb-8" {...book} />
          <h4
            className="font-sans text-flgray-900 text-base tracking-wider"
            dangerouslySetInnerHTML={{ __html: book.htmlShortTitle }}
          />
        </Link>
      ))}
    </div>
    {books.length - 4 > 0 && (
      <Button className="mx-auto mt-12 md:mt-6" to={t`/audiobooks`}>
        {t`View ${books.length - 4} More`} &rarr;
      </Button>
    )}
  </div>
);

export default AudioBooksBlock;
