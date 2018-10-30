// @flow
import * as React from 'react';
import styled from 'styled-components';

const StyledSidebar = styled.section`
  background: #caebf2;
  height: 100%;
  color: #666;
  padding: 1em;
  width: 260px;
  position: fixed;
`;

export default () => (
  <StyledSidebar>
    <ul>
      <li>
        <a href="#chapter-headings">Chapter Headings</a>
      </li>
      <li>
        <a href="#emphasis">Emphasis</a>
      </li>
    </ul>
  </StyledSidebar>
);
