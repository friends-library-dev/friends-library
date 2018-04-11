// @flow
import * as React from 'react';
import { css } from 'glamor';

const element = css`
  background: #eaeaea;
  color: #222;
  padding: 15px;
  font-size: 16px;
  width: 255px;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: fixed;
  display: none;

  & > h2 {
    margin-top: 0;
    text-align: center;
  }
`;

export default () => (
  <div id="Slideover" className={element}>
    <h2>¯\_(⊙︿⊙)_/¯</h2>
  </div>
);
