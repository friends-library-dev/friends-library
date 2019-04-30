import React from 'react';
import { CoverProps, FriendData } from './types';

// @ts-ignore
const friendData = window.Friends as FriendData;

const Cover: React.FC<CoverProps> = props => {
  const { title, author } = props;
  const [firstInitial, lastInitial] = initials(author);
  return (
    <div className="cover">
      <div className="bg-block" />
      <div className="back" />
      <div className="spine" />
      <div className="front">
        <img
          className="logo"
          src={`${process.env.PUBLIC_URL || ''}/images/logo-icon.png`}
          alt=""
        />
        <span className="first-initial initial">{firstInitial}</span>
        <span className="last-initial initial">{lastInitial}</span>
        <h1 className="title">{title}</h1>
        <div className="author">
          <div className="author-line" />
          <h2 className="author-name">{author}</h2>
        </div>
      </div>
    </div>
  );
};

export default Cover;

function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}
