import React, { useState, Fragment } from 'react';
import { styled } from '@friends-library/ui';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from 'emotion-theming';
import { Nav, enTheme, esTheme, Tailwind, Footer } from '@friends-library/ui';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import Slideover from './Slideover';
import './Layout.css';

const Content = styled.div`
  padding-top: 70px;
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
        <html lang={theme.lang} className={menuOpen ? 'Menu--open' : ''} />
        <title>Friends Library</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css"
          rel="stylesheet prefetch"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CoverWebStylesAllStatic />
        <CoverWebStylesSizes />
        <Slideover isOpen={menuOpen} close={() => setMenuOpen(false)} />
        <Nav
          menuOpen={menuOpen}
          className="Nav"
          onHamburgerClick={() => setMenuOpen(!menuOpen)}
        />
        <Content className="Content flex flex-col relative overflow-hidden bg-white min-h-screen">
          {children}
          <Footer />
        </Content>
      </ThemeProvider>
    </Fragment>
  );
};

export default Layout;
