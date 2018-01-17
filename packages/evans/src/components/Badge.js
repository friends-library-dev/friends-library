// @flow
import * as React from 'react';
import { css } from 'glamor';

const element = css`
  box-sizing: border-box;
  min-width: 22px;
  height: 22px;
  line-height: 22px;
  padding: 0 5px;
  border-radius: 500px;
  vertical-align: middle;
  background: #1e87f0;
  color: #fff;
  font-size: 13.25px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  children: React.Node,
};

export default ({ children }: Props) => (
  <span className={element}>
    {children}
  </span>
);
