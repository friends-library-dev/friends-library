import React from 'react';
import Link from 'gatsby-link';
import { CoverProps } from '@friends-library/types';
import { Front } from '@friends-library/cover-component';
import { t } from '../../translation';
import WaveBottomBlock from '../../blocks/WaveBottomBlock';
import Button from '../../Button';
import DownloadIcon from '../../icons/Download';
import AudioIcon from '../../icons/Audio';
import './PathBlock.css';

interface Props {
  color: 'blue' | 'gold' | 'maroon' | 'green';
  title: string;
  books: (CoverProps & {
    documentUrl: string;
    authorUrl: string;
    htmlShortTitle: string;
  })[];
}

const PathBlock: React.FC<Props> = ({ books, title, color, children }) => {
  return (
    <WaveBottomBlock color={color} className={`PathBlock p-12 text-fl${color}`}>
      <h2 className="heading-text mb-6">{title}</h2>
      <p className="body-text mb-12 max-w-4xl mx-auto">{children}</p>
      <div className="PathBooks md:flex flex-wrap text-gray-500 antialiased font-sans tracking-wider text-center relative">
        {books.map(book => (
          <div
            key={book.documentUrl}
            className="bg-red-100x pt-4 mb-6 md:mb-20 lg:mb-0 md:w-1/2 xl:w-1/4 relative"
          >
            <h3
              className="heading-text text-base mb-2 font-normal"
              dangerouslySetInnerHTML={{ __html: book.htmlShortTitle }}
            />
            <p className="text-center">
              <Link
                className="inline-block text-center strong-link text-sm mb-4"
                to={book.authorUrl}
              >
                {book.author}
              </Link>
            </p>
            <div className="flex flex-col items-center mt-6">
              <Front {...book} shadow={true} scaler={1 / 3} scope="1-3" />
              <div className="mt-2">
                <AudioIcon className="mr-2" />
                <DownloadIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button className="mx-auto mt-12 xl:mb-2">{t`View More`}</Button>
    </WaveBottomBlock>
  );
};

export default PathBlock;
