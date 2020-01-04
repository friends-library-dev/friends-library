import React, { useState, useEffect, Fragment } from 'react';
import cx from 'classnames';
import { styled, useNumCartItems, CartStore } from '@friends-library/ui';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from 'emotion-theming';
import { Nav, enTheme, esTheme, Tailwind, Footer } from '@friends-library/ui';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import Checkout from './Checkout';
import Slideover from './Slideover';
import './Layout.css';

const Content = styled.div`
  padding-top: 70px;
`;

interface Props {
  children: React.ReactNode;
}

const store = CartStore.getSingleton();

const Layout: React.FC<Props> = ({ children }) => {
  const theme = process.env.GATSBY_LANG === 'en' ? enTheme : esTheme;
  const [numCartItems] = useNumCartItems();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    store.on('toggle:visibility', setCheckoutModalOpen);
    return () => {
      store.removeListener('toggle:visibility', setCheckoutModalOpen);
    };
  });

  return (
    <Fragment>
      <Tailwind />
      <Helmet>
        <html
          lang={theme.lang}
          className={cx({
            'Menu--open': menuOpen,
            'Site--blur': menuOpen || checkoutModalOpen,
          })}
        />
        <title>Friends Library</title>
        <meta name="robots" content="noindex, nofollow" />
        <script src="https://js.stripe.com/v3/" async></script>
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
          onCartBadgeClick={() => store.open()}
          showCartBadge={numCartItems > 0}
        />
        <Content className="Content flex flex-col relative overflow-hidden bg-white min-h-screen">
          {children}
          <Footer />
        </Content>
        <Checkout isOpen={checkoutModalOpen} />
      </ThemeProvider>
    </Fragment>
  );
};

export default Layout;
