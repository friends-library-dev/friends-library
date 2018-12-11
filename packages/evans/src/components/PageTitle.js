// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import { h1 } from '../typography';

const PageTitle = styled.h1`
  compose: ${h1};
  margin: 10px 0 25px;
`;

type Props = {|
  children: React.Node,
|};

export default ({ children }: Props) => (
  <PageTitle>
    {children}
  </PageTitle>
);
