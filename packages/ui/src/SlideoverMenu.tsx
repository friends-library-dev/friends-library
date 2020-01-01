import React from 'react';
import Link from 'gatsby-link';
import FriendsLogo from './LogoFriends';
import Search from './Search';
import { useNumCartItems } from './checkout/hooks';
import './SlideoverMenu.css';

const SlideoverMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [numCartItems, , store] = useNumCartItems();
  return (
    <nav className="SlideoverMenu bg-flmaroon text-white">
      <header className="p-5 flex border-b-4">
        <span className="w-12 text-xl md:text-2xl p-1" onClick={onClose}>
          &#x2715;
        </span>
        <div className="flex-grow">
          <FriendsLogo className="m-auto" />
        </div>
        <i className="w-12" />
      </header>
      <div className="py-12 pl-16 md:pl-24">
        <Search className="mb-4" expanded onClick={() => {}} onBlur={() => {}} />
        <LinkGroup
          links={[
            ['/getting-started', 'Getting Started'],
            ['/explore', 'Explore Books'],
            ['/audiobooks', 'Audio Books'],
            ['/friends', 'All Friends'],
          ]}
        />
        <LinkGroup
          links={[
            ['/quakers', 'About the Quakers'],
            ['/modernization', 'About Modernization'],
            ['/editions', 'About Book Editions'],
            ['/about', 'About This Site'],
          ]}
        />
        <LinkGroup
          links={[
            ['/audio-help', 'Audio Help'],
            ['/ebook-help', 'E-Book Help'],
            ['/contact', 'Contact Us'],
            () => (
              <button
                className="pl-4"
                onClick={() => {
                  onClose();
                  store.open();
                }}
              >
                Cart ({numCartItems})
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
    {links.map((link, idx) => {
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

type LinkItem = [string, string] | (() => JSX.Element);
