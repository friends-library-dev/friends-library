import React from 'react';
import cx from 'classnames';
import { getHtmlFragments, overridable, initials, prepareTitle } from './helpers';
import { CoverProps } from '@friends-library/types';

type Props = Pick<
  CoverProps,
  'title' | 'customHtml' | 'author' | 'showGuides' | 'lang' | 'isCompilation'
>;

const FrontMain: React.FC<Props> = ({
  showGuides,
  author,
  title,
  lang,
  isCompilation,
  customHtml,
}) => {
  const fragments = getHtmlFragments(customHtml);
  const [firstInitial, lastInitial] = initials(author, title, lang, isCompilation);
  return (
    <div
      className={cx(
        'front__main',
        `front__main--first-initial--${firstInitial}`,
        `front__main--initials--${firstInitial}${lastInitial}`,
      )}
    >
      {showGuides ? (
        <>
          <div className="guide guide--letter-spacing" />
          <div className="guide guide--vertical guide--front-vertical-center" />
        </>
      ) : null}
      <div className="initials">
        <div className="initials__top">
          <span
            className={cx(
              'initial',
              'initial--first',
              `initial--X${lastInitial}`,
              `initial--${firstInitial}`,
              `initials--${firstInitial}${lastInitial}`,
            )}
          >
            {firstInitial}
          </span>
        </div>
        <div className="initials__bottom">
          <span
            className={cx(
              'initial',
              'initial--last',
              `initial--${firstInitial}X`,
              `initial--${lastInitial}`,
              `initials--${firstInitial}${lastInitial}`,
            )}
          >
            {lastInitial}
          </span>
        </div>
      </div>
      {overridable(
        'title-wrap',
        fragments,
        <div className="title-wrap">
          <h1
            className="title"
            dangerouslySetInnerHTML={{ __html: prepareTitle(title, author, 'front') }}
          />
        </div>,
      )}
    </div>
  );
};

export default FrontMain;
