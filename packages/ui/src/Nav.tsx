import React, { useState } from 'react';
import styled from './styled';
import Link from 'gatsby-link';
import cx from 'classnames';
import { withTheme } from 'emotion-theming';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import Hamburger from './Hamburger';
import Search from './Search';
import CartBadge from './CartBadge';
import { Theme } from './theme';

const StyledNav = styled('nav')`
  display: flex;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #eaeaea;
  height: 70px;
  padding: 0 20px 0 0;

  & > * {
    margin: auto 0;
  }

  .HomeLink {
    margin: 0;
  }

  a:link {
    border-bottom-width: 0;
  }

  .Logo {
    transition: width 0.25s ease-out;
    width: ${p => (p.theme.lang === 'en' ? 140 : 190)}px;
    height: 100%;
    display: block;
  }

  .Friends,
  .Icon {
    fill: ${p => p.theme.primary.hex};
  }

  .Library {
    fill: ${p => p.theme.black.hex};
  }

  .Search {
    display: none;
  }

  @media (max-width: 670px) {
    &.searching .Logo {
      width: 145px;
    }
  }

  @media (max-width: 570px) {
    &.searching .Logo {
      width: 100px;
    }
  }

  @media (min-width: 545px) {
    .Logo {
      width: ${p => (p.theme.lang === 'en' ? 150 : 210)}px;
    }
    .Search {
      display: block;
    }
  }
`;

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
    <StyledNav className={cx(className, { searching })}>
      <Hamburger menuOpen={menuOpen} onClick={onHamburgerClick} />
      <Link className="HomeLink" to="/">
        {theme.lang === 'en' ? <FriendsLogo /> : <AmigosLogo />}
      </Link>
      <div className="flex">
        <Search
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
    </StyledNav>
  );
};

export default withTheme(Component);
