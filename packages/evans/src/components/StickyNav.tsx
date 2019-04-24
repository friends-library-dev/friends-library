import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { t } from 'ttag';

const StickyNav = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 3;
  text-transform: uppercase;
  letter-spacing: 5px;
  height: 52px;
`;

const logo = css`
  display: inline-block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  text-decoration: none;
  && {
    color: #fff;
  }
`;

const hamburger = css`
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 26px;
`;

interface Props {
  onHamburgerClick: () => void;
}

export default ({ onHamburgerClick }: Props) => (
  <StickyNav>
    <span css={hamburger} onClick={onHamburgerClick}>
      ☰
    </span>
    <Link to="/" css={logo}>
      {t`The Friends Library`}
    </Link>
  </StickyNav>
);
