import React from 'react';
import { styled } from '@friends-library/ui';
import { h1 } from '../typography';

const PageTitle = styled.h1`
  compose: ${h1};
  margin: 10px 0 25px;
`;

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => <PageTitle>{children}</PageTitle>;
