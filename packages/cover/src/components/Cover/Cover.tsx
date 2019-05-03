import React from 'react';
import { isBrowser } from 'browser-or-node';
import { CoverProps } from './types';
import LogoIcon from './LogoIcon';

const publicUrl = process.env.PUBLIC_URL || '';

const Cover: React.FC<CoverProps> = props => {
  const { title, author, isbn, edition, blurb, showGuides } = props;
  const [firstInitial, lastInitial] = initials(author);
  return (
    <div className={`cover${showGuides ? ' cover--show-guides' : ''}`}>
      {isBrowser && <div className="cover-mask" />}
      <div className="bg-block" />
      <div className="back">
        <div className="back__safe">
          <div className="blurb">{blurb}</div>
          {isbn && (
            <img className="isbn" src={`${publicUrl}/images/isbn/${isbn}.png`} alt="" />
          )}
        </div>
      </div>
      <div className="spine">
        <div className="spine__title">{title}</div>
        <LogoIcon />
        <div className="guide guide--spine guide--vertical guide--spine-center" />
      </div>
      <div className="front">
        <div className="front__safe">
          <div className="diamond">
            <div className="diamond__shape" />
            <div className="diamond__initial">{edition[0].toUpperCase()}</div>
          </div>
          <LogoIcon />
          <span className="first-initial initial">{firstInitial}</span>
          <span className="last-initial initial">{lastInitial}</span>
          <h1 className="title">{title}</h1>
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
