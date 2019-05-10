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
  const { title, author, isbn, edition, blurb, showGuides } = props;
  const [firstInitial, lastInitial] = initials(author);
  const Diamond = Diamonds[edition];
  return (
    <div className={`cover${showGuides ? ' cover--show-guides' : ''}`}>
      {isBrowser && <div className="cover-mask" />}
      <div className="bg-block" />
      <div className="back">
        <div className="back__safe">
          <Diamond />
          <LogoIcon />
          <Brackets />
          <div className="blurb">{blurb}</div>
          {isbn && (
            <img className="isbn" src={`${publicUrl}/images/isbn/${isbn}.png`} alt="" />
          )}
          <p className="purpose">
            Friends Library Publishing exists to freely share the writings of early
            members of the Religious Society of Friends (Quakers) in digital, audio, and
            printed formats, believing them to contain a powerful testimony to the purity
            and simplicity of primitive, biblical Christianity.
          </p>
          <Logo />
        </div>
      </div>
      <div className="spine">
        <LogoIcon />
        <Diamond />
        <div className="spine__title" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="spine__author">{author.split(' ').pop()}</div>
        <div className="guide guide--spine guide--vertical guide--spine-center" />
      </div>
      <div className="front">
        <div className="front__safe">
          <Diamond />
          <LogoIcon />
          <span
            className={classNames(
              'initial',
              'initial--first',
              `initial--${firstInitial}`,
              `initials--${firstInitial}${lastInitial}`,
            )}
          >
            {firstInitial}
          </span>
          <span
            className={classNames(
              'initial',
              'initial--last',
              `initial--${lastInitial}`,
              `initials--${firstInitial}${lastInitial}`,
            )}
          >
            {lastInitial}
          </span>
          <h1 className="title" dangerouslySetInnerHTML={{ __html: title }} />
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
