// @flow
import * as React from 'react';
import { css } from 'glamor';
import Block from './Block';

const element = css`
  color: #fff;
  background: #444;
  background-size: cover;
  position: relative;

  :after {
    content: "''";
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
  <Block className={element}>
    <h1>
      Dedicated to the preservation and free distribution of early Quaker writings
    </h1>

    <p>
      {/* eslint-disable max-len */}
      This website exists to freely share the writings of early members of the Religious Society of Friends (Quakers) in digital, audio, and printed formats, believing them to contain a powerful testimony to the purity and simplicity of primitive, biblical Christianity.
      {/* eslint-enable max-len */}
    </p>
  </Block>
);
