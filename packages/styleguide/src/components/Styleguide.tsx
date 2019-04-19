import * as React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader';
import Sidebar from './Sidebar';
import Content from './Content';

const StyledApp = styled.div``;

const App = () => (
  <StyledApp>
    <Sidebar />
    <Content />
  </StyledApp>
);

export default hot(module)(App);
