import React, { Fragment } from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import Helmet from 'react-helmet';
import { Nav } from '@friends-library/ui';
import Slideover from './Slideover';
import Footer from './Footer';
import theme from '../theme';
import './Layout.css';

const Content = styled.div`
  padding-top: 90px;
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
  menuOpen: boolean;
}

export default class Layout extends React.Component<Props, State> {
  public state = {
    menuOpen: false,
  };

  public render(): JSX.Element {
    const { menuOpen } = this.state;
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
          <Slideover isOpen={false} close={() => this.setState({ menuOpen: false })} />
          <Nav
            menuOpen={menuOpen}
            className="Nav"
            onHamburgerClick={() => this.setState({ menuOpen: !menuOpen })}
          />
          <Content>
            {children}
            <Footer />
          </Content>
        </ThemeProvider>
      </Fragment>
    );
  }
}
