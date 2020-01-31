import React, { useState } from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { withTheme } from 'emotion-theming';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import Hamburger from './Hamburger';
import Search from './Search';
import CartBadge from './CartBadge';
import { Theme } from './theme';
import './Nav.css';

interface Props {
  theme: Theme;
  menuOpen: boolean;
  className?: string;
  showCartBadge: boolean;
  onCartBadgeClick: () => void;
  onHamburgerClick: () => void;
  initialSearching?: boolean;
}

const Component: React.FC<Props> = ({
  className,
  menuOpen,
  initialSearching,
  onHamburgerClick,
  onCartBadgeClick,
  showCartBadge,
  theme,
}) => {
  const [searching, setSearching] = useState<boolean>(initialSearching || false);
  return (
    <nav
      className={cx(className, 'flex justify-between bg-white border-gray-300 border-b', {
        searching,
      })}
    >
      <Hamburger menuOpen={menuOpen} onClick={onHamburgerClick} />
      <Link className="m-0" to="/">
        {theme.lang === 'en' ? (
          <FriendsLogo className="h-full block transition-ease-out-1/4s" />
        ) : (
          <AmigosLogo className="h-full block transition-ease-out-1/4s" />
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

export default withTheme(Component);
