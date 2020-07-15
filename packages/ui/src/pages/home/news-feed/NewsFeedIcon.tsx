import React from 'react';
import cx from 'classnames';
import { NewsFeedType } from '@friends-library/types';
import BookIcon from '../../../icons/Book';
import StarIcon from '../../../icons/Star';
import GlobeIcon from '../../../icons/Globe';
import BookmarkIcon from '../../../icons/Bookmark';
import HeadphonesIcon from '../../../icons/Headphones';
import { COLOR_MAP } from './news-feed';

interface Props {
  type: NewsFeedType;
  className?: string;
}

const NewsFeedIcon: React.FC<Props> = ({ className, type }) => {
  let Icon = BookIcon;

  switch (type) {
    case `audiobook`:
      Icon = HeadphonesIcon;
      break;
    case `spanish_translation`:
      Icon = GlobeIcon;
      break;
    case `feature`:
      Icon = StarIcon;
      break;
    case `chapter`:
      Icon = BookmarkIcon;
      break;
  }
  return (
    <div
      className={cx(className, `text-white w-10 h-10 rounded-full bg-${COLOR_MAP[type]}`)}
    >
      <Icon />
    </div>
  );
};

export default NewsFeedIcon;
