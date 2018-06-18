// @flow
import * as React from 'react';
import { css } from 'glamor';
import Block from './Block';

const element = css`
  background-color: #000;
  color: #fff;
`;

export default () => (
  <Block className={element}>
    <h1>Footer</h1>
  </Block>
);
