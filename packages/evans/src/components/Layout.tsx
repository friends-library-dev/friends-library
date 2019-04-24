import React, { Fragment } from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import Helmet from 'react-helmet';
import Slideover from './Slideover';
import StickyNav from './StickyNav';
import Footer from './Footer';
import theme from '../theme';
import './Layout.css';

const Content = styled.div`
  padding-top: 52px;
  position: relative;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const html = css`
  & a {
    color: ${theme.primary};
  }
  & a:hover {
    border-bottom-color: ${theme.primary};
  }
`;

interface Props {
  children: React.ReactNode;
}

interface State {
  navOpen: boolean;
}

export default class Layout extends React.Component<Props, State> {
  public state = {
    navOpen: false,
  };

  public render(): JSX.Element {
    const { navOpen } = this.state;
    const { children } = this.props;
    return (
      <Fragment>
        <Global styles={html} />
        <Helmet>
          <html lang="en" />
          <title>Friends Library</title>
          <meta name="robots" content="noindex, nofollow" />
          <link
            href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css"
            rel="stylesheet prefetch"
          />
        </Helmet>
        <ThemeProvider theme={theme}>
          <Slideover isOpen={navOpen} close={() => this.setState({ navOpen: false })} />
          <StickyNav onHamburgerClick={() => this.setState({ navOpen: !navOpen })} />
          <Content>
            {children}
            <Footer />
          </Content>
        </ThemeProvider>
      </Fragment>
    );
  }
}
