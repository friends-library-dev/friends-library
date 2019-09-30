import React from 'react';
import cx from 'classnames';
import { CoverProps } from '@friends-library/types';
import { overridable } from './overrides';
import LogoIcon from './LogoIcon';

const CoverFront: React.FC<CoverProps> = ({
  lang,
  title,
  author,
  showGuides,
  edition,
}) => {
  const fragments = {}; // @TODO
  const [firstInitial, lastInitial] = initials(author);
  return (
    <div className={`CoverFront Edition--${edition} Lang--${lang}`}>
      <div className="bg-block" />
      <div className="front__safe">
        <span className="flp">
          {lang === 'es' ? 'Biblioteca de los Amigos' : 'Friends Library Publishing'}
        </span>
        <LogoIcon />
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
              <h1 className="title" dangerouslySetInnerHTML={{ __html: title }} />
            </div>,
          )}
        </div>
        {overridable(
          'author',
          fragments,
          <div className="author">
            <div className="author__line" />
            <h2 className="author__name">{author}</h2>
          </div>,
        )}
      </div>
    </div>
  );
};

export default CoverFront;

function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}
