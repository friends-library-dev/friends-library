import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { ThreeD as Front } from '@friends-library/cover-component';
import { t } from '../../translation';
import { LANG } from '../../env';
import Button from '../../Button';
import { FeaturedBookProps } from './FeaturedBooksBlock';

const Book: React.FC<FeaturedBookProps & { isCurrent: boolean }> = props => {
  const {
    featuredDesc,
    documentUrl,
    authorUrl,
    htmlShortTitle,
    isCurrent,
    ...coverProps
  } = props;
  return (
    <div
      className={cx(
        'Book px-12 md:px-16 flex flex-col md:flex-row w-screen',
        isCurrent && 'order-first',
      )}
    >
      <div className="flex flex-col items-center md:items-end md:w-2/5 md:mr-16">
        <div className="mb-8 md:hidden">
          <Front {...coverProps} size="m" scope="1-2" scaler={1 / 2} />
        </div>
        <div className="hidden md:block">
          <Front {...coverProps} size="m" scope="3-5" scaler={3 / 5} />
        </div>
      </div>
      <div className="Text md:w-3/5 flex-grow flex flex-col justify-start">
        <h2
          className="font-sans text-gray-800 text-2xl mb-4 md:mb-6 leading-relaxed tracking-wider font-bold"
          dangerouslySetInnerHTML={{ __html: htmlShortTitle }}
        />
        {LANG === 'en' && (
          <p className="hidden sm:block font-sans uppercase text-gray-800 text-lg tracking-widest font-black mb-6">
            Modernized Edition
          </p>
        )}
        <p className="font-serif text-lg md:text-xl opacity-75 leading-relaxed max-w-2xl">
          {featuredDesc}
        </p>
        {!props.author.startsWith('Compila') && (
          <p className="mb-10 md:mb-0 my-6">
            <em className="font-serif font-black text-lg antialiased pr-2">{t`by`}:</em>{' '}
            <Link
              to={authorUrl}
              className="font-serif uppercase text-lg antialiased font-bold text-flblue bracketed"
            >
              {props.author}
            </Link>
          </p>
        )}
        <Button
          bg="green"
          to={documentUrl}
          className={cx('mx-auto md:mx-0', {
            'mt-12': props.author.startsWith('Compila'),
            'sm:mt-0 md:mt-10': !props.author.startsWith('Compila'),
          })}
        >
          {t`Download`} &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Book;
