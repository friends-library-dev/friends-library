// @flow
import * as React from 'react';
import styled from 'styled-components';

const StyledSidebar = styled.section`
  background: #333;
  height: 100%;
  color: white;
  width: 200px;
  position: fixed;
`;

export default () => (
  <StyledSidebar>
    Sidebar Content
  </StyledSidebar>
);
