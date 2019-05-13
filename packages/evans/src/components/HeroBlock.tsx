import React from 'react';
import { css } from '@emotion/core';
import Block from './Block';

const element = css`
  color: #fff;
  background: #444;
  background-size: cover;
  position: relative;

  :after {
    content: '';
    position: absolute;
    background: rgba(0, 0, 0, 0.45);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  > h1 {
    margin: 8px 0 0;
    font-size: 21px;
    font-weight: 400;
    line-height: 1.2em;
    text-align: center;
    position: relative;
    color: #fff;
    z-index: 2;
  }

  > p {
    color: #fff;
    background: rgba(0, 0, 0, 0.9);
    padding: 10px;
    border-radius: 10px;
    margin: 20px 0 10px;
  }
`;

export default () => (
  <Block css={element}>
    <h1>Dedicated to the preservation and free distribution of early Quaker writings</h1>

    <p>
      This website exists to freely share the writings of early members of the Religious
      Society of Friends (Quakers), believing that no other collection of Christian
      writings more accurately communicates or powerfully illustrates the
      soul-transforming power of the gospel of Jesus Christ.
    </p>
  </Block>
);
