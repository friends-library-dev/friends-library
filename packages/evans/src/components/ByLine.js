// @flow
import * as React from 'react';
import { h2 } from './Typography';

type Props = {|
  children: React.Node,
|};

export default ({ children }: Props) => (
  <h2 className={h2}>
    {children}
  </h2>
);
