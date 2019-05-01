import React from 'react';
import { CoverProps } from './types';
import LogoIcon from './LogoIcon';

const Cover: React.FC<CoverProps> = props => {
  const { title, author, isbn, edition, blurb } = props;
  const [firstInitial, lastInitial] = initials(author);
  return (
    <div className="cover">
      <div className="bg-block" />
      <div className="back">
        <div className="blurb">{blurb}</div>
        {isbn && (
          <img
            className="isbn"
            src={`${process.env.PUBLIC_URL || ''}/images/isbn/${isbn}.png`}
            alt=""
          />
        )}
      </div>
      <div className="spine" />
      <div className="front">
        <div className="diamond-wrap">
          <div className="diamond" />
          <div className="edition-initial">{edition[0].toUpperCase()}</div>
        </div>
        <LogoIcon />
        <span className="first-initial initial">{firstInitial}</span>
        <span className="last-initial initial">{lastInitial}</span>
        <h1 className="title">{title}</h1>
        <div className="author">
          <div className="author-line" />
          <h2 className="author-name">{author}</h2>
        </div>
      </div>
      <div className="guide guide--box guide--trim-bleed" />
      <div className="guide guide--box guide--safety guide--safety-front" />
      <div className="guide guide--box guide--safety guide--safety-back" />
      <div className="guide guide--spine guide--vertical guide--spine-right" />
      <div className="guide guide--spine guide--vertical guide--spine-left" />
    </div>
  );
};

export default Cover;

function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}
