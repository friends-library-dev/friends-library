import React, { useState } from 'react';
import styled from '@emotion/styled';
import Link from 'gatsby-link';
import cx from 'classnames';
import Logo from './Logo';
import Hamburger from './Hamburger';
import Search from './Search';

const StyledNav = styled('nav')`
  display: flex;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #eaeaea;
  height: 90px;
  padding: 0 25px;

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
    width: 140px;
    height: 100%;
  }

  .Friends,
  .Icon {
    fill: #6c3142;
  }

  .Library {
    fill: #2d2a29;
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
      width: 170px;
    }
    .Search {
      display: block;
    }
  }
`;

interface Props {
  menuOpen: boolean;
  className?: string;
  onHamburgerClick: () => void;
  initialMenuOpen?: boolean;
  initialSearching?: boolean;
}

const Component: React.FC<Props> = ({ className, initialMenuOpen, initialSearching }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(initialMenuOpen || false);
  const [searching, setSearching] = useState<boolean>(initialSearching || false);
  return (
    <StyledNav className={cx(className, { searching })}>
      <Hamburger menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
      <Link className="HomeLink" to="/">
        <Logo />
      </Link>
      <Search
        expanded={searching}
        onClick={() => {
          if (!searching) {
            setSearching(true);
          }
        }}
        onBlur={() => setSearching(false)}
      />
    </StyledNav>
  );
};

export default Component;
