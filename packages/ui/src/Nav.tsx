import React, { useState } from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { LANG } from './env';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import Hamburger from './Hamburger';
import Search from './Search';
import CartBadge from './CartBadge';
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
  return (
    <nav
      className={cx('Nav flex justify-between bg-white border-gray-300 border-b', {
        searching,
      })}
    >
      <Hamburger onClick={onHamburgerClick} />
      <Link className="m-0" to="/">
        {LANG === 'es' ? (
          <AmigosLogo className="h-full block transition-ease-out-1/4s" />
        ) : (
          <FriendsLogo className="h-full block transition-ease-out-1/4s" />
        )}
      </Link>
      <div className="flex items-center">
        <Search
          className="hidden"
          autoFocus
          expanded={searching}
          onClick={() => {
            if (!searching) {
              setSearching(true);
            }
          }}
          onBlur={() => setSearching(false)}
        />
        {showCartBadge && <CartBadge onClick={onCartBadgeClick} />}
      </div>
    </nav>
  );
};

export default Nav;
