// @flow
import * as React from 'react';
import styled from 'styled-components';
import * as c from '../cases';

const StyledContent = styled.section`
  background: rgba(100, 0, 0, 0.1);
  padding: 1em 1em 1em 220px;
`;

export default () => (
  <StyledContent>
    <c.Emphasis />
  </StyledContent>
);
