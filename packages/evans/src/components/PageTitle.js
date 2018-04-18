// @flow
import * as React from 'react';
import { css } from 'glamor';
import { classes } from 'lib/css';
import { h1 } from './Typography';

const title = css`
  margin: 10px 0 25px;
`;

type Props = {|
  children: React.Node,
|};

export default ({ children }: Props) => (
  <h1 className={classes(title, h1)}>
    {children}
  </h1>
);
