import React, { useState, useEffect } from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { useEscapeable } from '@friends-library/ui';
import { LANG } from './env';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import Hamburger from './Hamburger';
import CartBadge from './CartBadge';
import TopNavSearch from './algolia/TopNavSearch';
import './Nav.css';

interface Props {
  showCartBadge: boolean;
  onCartBadgeClick: () => void;
  onHamburgerClick: () => void;
  initialSearching?: boolean;
}

const Nav: React.FC<Props> = ({
  initialSearching,
  onHamburgerClick,
  onCartBadgeClick,
  showCartBadge,
}) => {
  const [searching, setSearching] = useState<boolean>(initialSearching || false);
  useEscapeable('.TopNavSearch', searching, setSearching);
  const Logo = LANG === 'es' ? AmigosLogo : FriendsLogo;

  useEffect(() => {
    const vimActivate: (e: KeyboardEvent) => any = e => {
      if (!searching && e.keyCode === FORWARD_SLASH && !e.shiftKey) {
        e.preventDefault();
        setSearching(true);
      }
    };
    document.addEventListener('keydown', vimActivate);
    return () => {
      window.removeEventListener('keydown', vimActivate);
    };
  }, [searching, setSearching]);

  return (
    <nav
      className={cx('Nav flex bg-white border-gray-300 border-b', {
        searching,
        'showing-cart': showCartBadge,
      })}
    >
      <Hamburger
        onClick={onHamburgerClick}
        className={cx('flex-grow-0', {
          'mr-6': !searching,
          'mr-0 sm:mr-6': searching,
        })}
      />
      <Link
        className={cx('m-0 sm:inline mr-4 sm:mr-0', {
          'hidden flex-grow-0': searching,
          'flex-grow': !searching,
        })}
        to="/"
      >
        <Logo className="h-full block mx-auto" />
      </Link>
      <TopNavSearch className="flex" searching={searching} setSearching={setSearching} />
      {showCartBadge && (
        <div
          className={cx(
            'ml-2 flex-col justify-center items-end flex-growx sm:flex-grow-0',
            {
              'hidden sm:flex': searching,
              flex: !searching,
            },
          )}
        >
          <CartBadge onClick={onCartBadgeClick} />
        </div>
      )}
    </nav>
  );
};

export default Nav;

const FORWARD_SLASH = 191;
