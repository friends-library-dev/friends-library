import React from 'react';
import cx from 'classnames';
import { Lang, Html } from '@friends-library/types';
import { overridable } from './overrides';
import LogoIcon from './LogoIcon';

interface Props {
  lang: Lang;
  firstInitial: string;
  lastInitial: string;
  title: string;
  author: string;
  fragments: Record<string, Html>;
}

const CoverFront: React.FC<Props> = ({
  lang,
  firstInitial,
  lastInitial,
  title,
  author,
  fragments,
}) => {
  return (
    <div className="front">
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
          <div className="guide guide--letter-spacing" />
          <div className="guide guide--vertical guide--front-vertical-center" />
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
