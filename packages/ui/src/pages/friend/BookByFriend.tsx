import React from 'react';
import cx from 'classnames';
import { CoverProps } from '@friends-library/types';
import { ThreeD } from '@friends-library/cover-component';
import Button from '../../Button';
import ClockIcon from '../../icons/Clock';
import TagsIcon from '../../icons/Tags';
import AudioIcon from '../../icons/Audio';
import DownloadIcon from '../../icons/Download';
import './BookByFriend.css';

type Props = CoverProps & {
  tags: string[];
  hasAudio: boolean;
  isAlone: boolean;
  pages: number;
  bookUrl: string;
  className?: string;
};

const BookByFriend: React.FC<Props> = props => {
  const { className, isAlone } = props;
  return (
    <div
      className={cx(
        className,
        'BookByFriend',
        'bg-white mt-20 flex flex-col items-center p-8 pt-0 max-w-2xl',
        'md:flex-row md:mt-0 md:ml-32 md:pb-4',
        'lg:ml-12',
        'xl:ml-24',
        {
          'BookByFriend--alone': isAlone,
          'BookByFriend--not-alone': !isAlone,
        },
      )}
    >
      <ThreeD
        {...props}
        scaler={1 / 2}
        scope="1-2"
        className="-mt-20 md:mt-4 md:-ml-32"
        shadow={true}
      />
      {!isAlone && (
        <ThreeD
          {...props}
          scaler={1 / 3}
          scope="1-3"
          className="mt-4 -ml-24"
          shadow={true}
        />
      )}
      <div className="mt-6 md:pl-6 md:py-6 lg:pl-2 lg:py-2 self-start flex flex-col">
        <h4
          className={cx(
            'text-center font-sans tracking-wider text-lg',
            'md:text-xl md:text-left',
            {
              'lg:text-lg': !isAlone,
              'xl:text-xl': !isAlone,
            },
          )}
        >
          {props.title}
        </h4>
        <p className="body-text mt-4 md:text-lg lg:text-base xl:text-lg">
          This is the modern edition of this book title. This is an explanation of what
          the difference is between the updated, modern and the real OG version.
        </p>
        <ul
          className={cx(
            'flex flex-wrap font-sans text-sm antialiased text-flgray-900 mt-4 leading-loose',
            'md:text-lg md:mt-6',
            !isAlone && 'lg:text-sm xl:text-lg',
          )}
        >
          <li className="text-sans w-1/2 pb-2">
            <ClockIcon className="mr-2" />
            {props.pages} pages
          </li>
          <li className="text-sans w-1/2 capitalize">
            <TagsIcon className="mr-2" />
            {props.tags.join(', ')}
          </li>
          <li className="text-sans w-1/2">
            <AudioIcon className="mr-2" />
            Audio Book
          </li>
          <li className="text-sans w-1/2">
            <DownloadIcon className="mr-2" />
            211 Downloads
          </li>
        </ul>
        <div className="flex flex-col items-center">
          <Button
            className="bg-flprimary mt-6 md:mt-10"
            to={props.bookUrl}
            shadow={false}
          >
            View Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookByFriend;
