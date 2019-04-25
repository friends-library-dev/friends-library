import React from 'react';

interface CoverProps {
  title: string;
  author: string;
}

const Cover: React.FC<CoverProps> = ({ title, author }) => {
  return (
    <div>
      <h1>{title}</h1>
      <h2>{author} test 7</h2>
    </div>
  );
};

export default Cover;
