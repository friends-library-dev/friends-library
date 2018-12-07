// @flow
import React, { useState, Fragment } from 'react'
import type { Node } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming'
import Helmet from 'react-helmet'
import Slideover from './Slideover';
import StickyNav from './StickyNav';
import Footer from './Footer';
import theme from '../theme';
import './Layout.css';

type Props = {|
  children: Node,
|};

const Content = styled.div`
  padding-top: 52px;
  position: relative;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default ({ children }: Props) => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <Fragment>
      <Helmet>
        <html lang="en" />
        <title>Friends Library</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css" rel="stylesheet prefetch" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <Slideover isOpen={navOpen} close={() => setNavOpen(false)} />
        <StickyNav onHamburgerClick={() => setNavOpen(!navOpen)} />
        <Content>
          {children}
          <Footer />
        </Content>
      </ThemeProvider>
    </Fragment>
  )
}
