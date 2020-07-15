import React from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { NewsFeedType } from '@friends-library/types';
import NewsFeedIcon from './NewsFeedIcon';
import { COLOR_MAP } from './news-feed';

interface Props {
  type: NewsFeedType;
  url: string;
  month: string;
  day: string;
  title: string;
  description: string;
  alt?: boolean;
}

const NewsFeedItem: React.FC<Props> = ({
  type,
  url,
  month,
  day,
  title,
  description,
  alt,
}) => {
  const color = COLOR_MAP[type];
  return (
    <FlexLink
      to={url}
      type={type}
      className={cx(`flex hover:bg-gray-200`, alt ? `bg-white` : `bg-flgray-100`)}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ minWidth: `6rem` }}
      >
        <NewsFeedIcon className="sm:hidden mb-3" type={type} />
        <p className="text-center text-xs sm:text-sm text-flgray-600 antialiased sans-wider">
          {month} {day}
        </p>
      </div>
      <div className="flex-grow pr-2 border-l border-gray-400 py-3 pl-4 sm:pl-6 pr-6 sm:pr-8 sm:flex items-center">
        <NewsFeedIcon className="hidden sm:block mr-6" type={type} />
        <div>
          <h3
            // purgecss: border-flblue border-flgold border-flmaroon border-flgreen
            // purgecss: text-flblue text-flgold text-flmaroon text-flgreen
            className={cx(
              `text-${color} sans-wide text-xl`,
              `border-b-4 border-${color}`,
              `pb-1 mb-3 inline-block`,
            )}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <h4
            className="body-text text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </FlexLink>
  );
};

export default NewsFeedItem;

const FlexLink: React.FC<{ className?: string; to: string; type: NewsFeedType }> = ({
  children,
  className,
  type,
  to,
}) => {
  if (type === `spanish_translation` || to.startsWith(`http`)) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};
