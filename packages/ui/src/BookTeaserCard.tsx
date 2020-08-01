import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { Front } from '@friends-library/cover-component';
import { CoverProps } from '@friends-library/types';
import { t } from '@friends-library/locale';
import { LANG } from './env';
import Button from './Button';
import Album from './Album';
import AudioDuration from './AudioDuration';
import './BookTeaserCard.css';

export type Props = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  audioDuration?: string;
  htmlShortTitle: string;
  documentUrl: string;
  authorUrl: string;
  description: string;
  badgeText?: string;
  className?: string;
};

const BookTeaserCard: React.FC<Props> = (props) => {
  const {
    htmlShortTitle,
    author,
    audioDuration,
    className,
    authorUrl,
    description,
    badgeText,
  } = props;
  const isAudio = typeof audioDuration === `string`;
  return (
    <div
      className={cx(
        className,
        `BookTeaserCard text-white items-start`,
        isAudio && `BookTeaserCard__Audio`,
        `sm:mx-24`,
        `md:flex md:mx-auto`,
      )}
    >
      <div
        className={cx(
          `CoverWrap flex justify-center md:pt-12 md:pl-10`,
          isAudio && `md:-ml-10`,
        )}
      >
        <div className="relative">
          {badgeText && <Badge>{badgeText}</Badge>}
          {isAudio && (
            <Link to={`${props.documentUrl}#audiobook`}>
              <Album {...props} className="" />
            </Link>
          )}
          {!isAudio && (
            <Link to={props.documentUrl}>
              <Front {...props} className="" size="m" scaler={1 / 3} scope="1-3" shadow />
            </Link>
          )}
        </div>
      </div>
      <div
        className={cx(
          `font-sans px-10 pb-10 pt-8 bg-white tracking-wider text-center`,
          `md:text-left md:bg-transparent md:pt-10`,
        )}
      >
        <h3 className="mb-4 text-base text-flgray-900 md:mb-2 md:pb-1">
          <Link
            to={props.documentUrl}
            className="hover:underline"
            dangerouslySetInnerHTML={{ __html: htmlShortTitle }}
          />
        </h3>
        <Link to={authorUrl} className="fl-underline text-sm text-flprimary">
          {author}
        </Link>
        {isAudio && (
          <AudioDuration className="mt-8 md:justify-start">{audioDuration}</AudioDuration>
        )}
        <p className={cx(`body-text text-left mt-6`, !isAudio && `md:pb-10`)}>
          {description}
        </p>
        {isAudio && (
          <Button
            to={`${props.documentUrl}#audiobook`}
            className="mx-auto md:mx-0 mt-6 max-w-full"
          >
            {t`Listen`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookTeaserCard;

const Badge: React.FC = ({ children }) => (
  <div
    className={`absolute antialiased top-0 left-0 bg-fl${
      LANG === `en` ? `gold` : `maroon`
    } flex flex-col items-center justify-center tracking-wide font-sans text-white rounded-full w-16 h-16 z-10 transform -translate-y-6 -translate-x-4`}
  >
    <span>{children}</span>
  </div>
);
