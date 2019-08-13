import React from 'react';
import { css } from '@emotion/core';
import Block from './Block';

interface Props {
  alt?: boolean;
  children: React.ReactNode;
}

const TempBlock: React.FC<Props> = ({ children, alt }) => {
  const element = css`
    background-color: ${alt ? '#ddd' : '#fff'};

    > h1 {
      margin-top: 0.3em;
    }

    > p {
      margin: 0 0 10px;
    }
  `;

  return (
    <Block className="font-serif" css={element}>
      {children}
    </Block>
  );
};

TempBlock.defaultProps = {
  alt: false,
};

export default TempBlock;
