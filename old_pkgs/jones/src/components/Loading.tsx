import * as React from 'react';
import styled from '@emotion/styled/macro';
import Centered from './Centered';

const H1 = styled.h1`
  opacity: 0.35;
`;

const Loading: React.FC = () => (
  <Centered>
    <H1>Loading...</H1>
  </Centered>
);

export default Loading;
