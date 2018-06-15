// @flow
import * as React from 'react';
import { css } from 'glamor';
import { t } from 'c-3po';
import { PRIMARY } from './Theme';

const element = css`
  background-color: ${PRIMARY};
  color: #fff;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;
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

export default () => (
  <div id="StickyNav" className={element}>
    <span id="Hamburger" className={hamburger}>
      ☰
    </span>
    <a href="/" className={logo}>
      {t`The Friends Library`}
    </a>
  </div>
);
