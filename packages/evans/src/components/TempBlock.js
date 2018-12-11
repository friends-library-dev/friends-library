// @flow
import * as React from 'react';
import { css } from '@emotion/core';
import Block from './Block';

type Props = {|
  alt?: boolean,
  children: React.Node,
|};

const TempBlock = ({ children, alt }: Props) => {
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
    <Block css={element}>
      {children}
    </Block>
  );
};

TempBlock.defaultProps = {
  alt: false,
};

export default TempBlock;
