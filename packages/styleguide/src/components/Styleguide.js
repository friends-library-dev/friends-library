// @flow
import * as React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Content from './Content';
import { hot } from 'react-hot-loader'

const StyledApp = styled.div`
  ${'' /* display: flex; */}
`;

const App = () => (
  <StyledApp>
    <Sidebar />
    <Content />
  </StyledApp>
);

export default hot(module)(App);
