import React, { useState, Fragment } from 'react';
import { styled } from '@friends-library/ui';
import Helmet from 'react-helmet';
import { ThemeProvider } from 'emotion-theming';
import { Nav, enTheme, esTheme, Tailwind, Footer } from '@friends-library/ui';
import Slideover from './Slideover';
import './Layout.css';

const Content = styled.div`
  padding-top: 90px;
  position: relative;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = process.env.GATSBY_LANG === 'en' ? enTheme : esTheme;
  return (
    <Fragment>
      <Tailwind />
      <Helmet>
        <html lang={theme.lang} />
        <title>Friends Library</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css"
          rel="stylesheet prefetch"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <Slideover isOpen={false} close={() => setMenuOpen(false)} />
        <Nav
          menuOpen={menuOpen}
          className="Nav"
          onHamburgerClick={() => setMenuOpen(!menuOpen)}
        />
        <Content>
          {children}
          <Footer />
        </Content>
      </ThemeProvider>
    </Fragment>
  );
};

export default Layout;
