import React from 'react';
import { CoverProps } from './types';

const Cover: React.FC<CoverProps> = props => {
  const { title, author } = props;
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
        <h1 className="title">{title}</h1>
        <h2 className="author">{author}</h2>
      </div>
    </div>
  );
};

export default Cover;
