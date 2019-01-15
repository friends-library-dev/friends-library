// @flow
import * as React from 'react';
import styled from '@emotion/styled';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default ({ children }) => (
  <Wrap>
    {children}
  </Wrap>
);
