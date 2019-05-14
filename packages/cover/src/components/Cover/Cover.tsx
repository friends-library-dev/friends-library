import React from 'react';
import { CoverProps } from '@friends-library/types';
import { isBrowser } from 'browser-or-node';
import classNames from 'classnames';
import LogoIcon from './LogoIcon';
import Logo from './Logo';
import Diamonds from './Diamonds';
import Brackets from './Brackets';

const publicUrl = process.env.PUBLIC_URL || '';

const Cover: React.FC<CoverProps> = props => {
  const { title, author, isbn, edition, blurb, showGuides, pages } = props;
  const [firstInitial, lastInitial] = initials(author);
  const Diamond = Diamonds[edition];
  return (
    <div className={`cover${showGuides ? ' cover--show-guides' : ''}`}>
      {isBrowser && <div className="cover-mask" />}
      <div className="bg-block" />
      <div className="back">
        <div className="back__safe">
          <Diamond />
          <Brackets />
          <div className="blurb">{blurb}</div>
          {isbn && (
            <img className="isbn" src={`${publicUrl}/images/isbn/${isbn}.png`} alt="" />
          )}
          <div className="about-flp">
            <p className="purpose">
              <b>Friends Library Publishing</b> exists to freely share the writings of
              early members of the Religious Society of Friends (Quakers), believing that
              no other collection of Christian writings more accurately communicates or
              powerfully illustrates the soul-transforming power of the gospel of Jesus
              Christ.
            </p>
            <p className="website">
              Download this and other books for free at <b>www.friendslibrary.com</b>.
            </p>
          </div>

          <Logo />
        </div>
      </div>
      <div className={spineClasses(pages)}>
        <LogoIcon />
        <Diamond />
        <div className="spine__title" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="spine__author">{author.split(' ').pop()}</div>
        <div className="guide guide--spine guide--vertical guide--spine-center" />
      </div>
      <div className="front">
        <div className="front__safe">
          <span className="flp">Friends Library Publishing</span>
          <LogoIcon />
          <div
            className={classNames(
              'front__main',
              `front__main--first-initial--${firstInitial}`,
            )}
          >
            <div className="guide guide--letter-spacing" />
            <div className="guide guide--vertical guide--front-vertical-center" />
            <div className="initials">
              <div className="initials__top">
                <span
                  className={classNames(
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
                  className={classNames(
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
            <div className="title-wrap">
              <h1 className="title" dangerouslySetInnerHTML={{ __html: title }} />
            </div>
          </div>
          <div className="author">
            <div className="author__line" />
            <h2 className="author__name">{author}</h2>
          </div>
        </div>
      </div>
      {isBrowser && (
        <>
          <div className="top" />
          <div className="bottom" />
          <div className="right" />
        </>
      )}
      <div className="guide guide--box guide--trim-bleed" />
      <div className="guide guide--spine guide--vertical guide--spine-left" />
      <div className="guide guide--spine guide--vertical guide--spine-right" />
    </div>
  );
};

export default Cover;

function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}

function spineClasses(pages: number): string {
  const classes = ['spine'];
  const rounded = Math.floor(pages / 10) * 10;
  for (let i = 130; i <= 220; i += 10) {
    rounded < i && classes.push(`spine--pgs-lt-${i}`);
    rounded <= i && classes.push(`spine--pgs-lte-${i}`);
    rounded > i && classes.push(`spine--pgs-gt-${i}`);
    rounded >= i && classes.push(`spine--pgs-gte-${i}`);
  }
  return classes.join(' ');
}
