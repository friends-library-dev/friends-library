// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import Centered from './Centered';

const H1 = styled.h1`
  opacity: 0.35;
`;

export default () => (
  <Centered>
    <H1>Loading...</H1>
  </Centered>
);
