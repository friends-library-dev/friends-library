// @flow
import * as React from 'react';
import { css } from 'glamor';

const element = css`
  background-color: #1e87f0;
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
  color: #fff;
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
  <div className={element}>
    <span className={hamburger}>
      ☰
    </span>
    <a href="/" className={logo}>
      Friends Library
    </a>
  </div>
);
