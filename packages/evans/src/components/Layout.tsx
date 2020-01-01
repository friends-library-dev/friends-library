import React, { useState, useEffect, Fragment } from 'react';
import cx from 'classnames';
import {
  styled,
  CheckoutModal,
  CartStore,
  CheckoutApi,
  CheckoutService,
  CheckoutMachine,
  CheckoutFlow,
} from '@friends-library/ui';
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

const store = CartStore.getSingleton();
const api = new CheckoutApi('/.netlify/functions/site');
const service = new CheckoutService(store.cart, api);
const machine = new CheckoutMachine(service);

const Layout: React.FC<Props> = ({ children }) => {
  const theme = process.env.GATSBY_LANG === 'en' ? enTheme : esTheme;
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    store.on('show', () => {
      setCheckoutModalOpen(true);
    });
    store.on('hide', () => {
      setCheckoutModalOpen(false);
    });
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
        />
        <Content className="Content flex flex-col relative overflow-hidden bg-white min-h-screen">
          {children}
          <Footer />
        </Content>
        {checkoutModalOpen && (
          <CheckoutModal onClose={() => store.close()}>
            <CheckoutFlow machine={machine} recommendedBooks={[]} />
          </CheckoutModal>
        )}
      </ThemeProvider>
    </Fragment>
  );
};

export default Layout;
