// @flow
import * as React from 'react';
import styled from 'styled-components';
import * as c from '../cases';

const StyledContent = styled.section`
  background: rgba(239, 239, 239, 0.7);
  padding: 0.5em 35px 1em 320px;
  min-height: 100vh;
`;

export default () => (
  <StyledContent>
    <c.ChapterHeadings />
    <c.Emphasis />
  </StyledContent>
);
