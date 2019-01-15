// @flow
import * as React from 'react';
import styled from '@emotion/styled';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  h1 {
    opacity: 0.35;
  }
`;

export default () => (
  <Wrap>
    <h1>Loading...</h1>
  </Wrap>
);
