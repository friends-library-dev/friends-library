import React from 'react';
import Link from 'gatsby-link';
import { Lang } from '@friends-library/types';
import { t } from '@friends-library/ui';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import Search from './Search';
import { LANG } from './env';
import { useCartTotalQuantity } from './checkout/hooks';
import './SlideoverMenu.css';

const SlideoverMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cartQty, , store] = useCartTotalQuantity();
  const Logo = LANG === 'en' ? FriendsLogo : AmigosLogo;
  return (
    <nav className="SlideoverMenu bg-flmaroon text-white">
      <header className="p-5 flex border-b-4 border-flprimary-800">
        <span className="w-12 text-xl md:text-2xl p-1" onClick={onClose}>
          &#x2715;
        </span>
        <div className="flex-grow">
          <Logo
            className="m-auto"
            iconColor="white"
            friendsColor="white"
            libraryColor="white"
          />
        </div>
        <i className="w-12" />
      </header>
      <div className="py-12 pl-16 md:pl-24">
        <Search className="mb-4" expanded onClick={() => {}} onBlur={() => {}} />
        <LinkGroup
          links={[
            [t`/getting-started`, t`Getting Started`],
            [t`/explore`, t`Explore Books`],
            [t`/audiobooks`, t`Audio Books`],
            [t`/friends`, t`All Friends`],
          ]}
        />
        <LinkGroup
          links={[
            [t`/quakers`, t`About the Quakers`],
            ['/modernization', 'About Modernization', 'en'],
            ['/editions', 'About Book Editions', 'en'],
            ['/spanish-translations', 'About Spanish Books', 'en'],
            ['/nuestras-traducciones', 'Nuestras Traducciones', 'es'],
            [t`/about`, t`About this Site`],
          ]}
        />
        <LinkGroup
          links={[
            [t`/audio-help`, t`Audio Help`],
            [t`/ebook-help`, t`E-Book Help`],
            [t`/contact`, t`Contact Us`],
            () => (
              <button
                className="pl-4"
                onClick={() => {
                  onClose();
                  store.open();
                }}
              >
                {t`Cart`} ({cartQty})
              </button>
            ),
          ]}
        />
      </div>
    </nav>
  );
};

export default SlideoverMenu;

const LinkGroup: React.FC<{ links: LinkItem[] }> = ({ links }) => (
  <ul className="LinkGroup py-4 text-lg md:text-xl tracking-wider antialiased">
    {links
      .filter(([, , lang]) => !lang || lang === LANG)
      .map((link, idx) => {
        if (typeof link == 'function') {
          return (
            <li className="py-2" key={`fn-${idx}`}>
              {link()}
            </li>
          );
        }
        const [href, text] = link;
        return (
          <li className="py-2" key={href}>
            <Link to={href}>{text}</Link>
          </li>
        );
      })}
  </ul>
);

type LinkItem = [string, string, Lang?] | (() => JSX.Element);
