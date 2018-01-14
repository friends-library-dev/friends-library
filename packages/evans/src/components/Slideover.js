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

  & > h2 {
    margin-top: 0;
  }
`;

export default () => (
  <div className={element}>
    <h2>Friends</h2>
    <ul>
      <li>
        <a href="/friend/rebecca-jones">Rebecca Jones</a>
      </li>
      <li>
        <a href="/friend/isaac-penington">Isaac Penington</a>
      </li>
      <li>
        <a href="/friend/robert-barclay">Robert Barclay</a>
      </li>
      <li>
        <a href="/friend/john-gratton">John Gratton</a>
      </li>
      <li>
        <a href="/friend/john-burnyeat">John Burnyeat</a>
      </li>
      <li>
        <a href="/friend/stephen-crisp">Stephen Crisp</a>
      </li>
      <li>
        <a href="/friend/catherine-payton-phillips">Catherine Phillips</a>
      </li>
      <li>
        <a href="/friend/john-griffeth">John Griffeth</a>
      </li>
      <li>
        <a href="/friend/thomas-story">Thomas Story</a>
      </li>
      <li>
        <a href="/friend/william-penn">William Penn</a>
      </li>
    </ul>
  </div>
);
