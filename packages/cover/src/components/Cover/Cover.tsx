import React from 'react';
import { CoverProps } from './types';

const Cover: React.FC<CoverProps> = props => {
  const { title, author } = props;
  return (
    <div className="cover">
      <h1>{title}</h1>
      <h2>{author}</h2>
    </div>
  );
};

export default Cover;
