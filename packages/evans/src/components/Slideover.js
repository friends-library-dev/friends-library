// @flow
import * as React from 'react';
import { css } from 'glamor';
import { sync as glob } from 'glob';
import { basename } from 'path';
import { getFriend } from '../server/helpers';

const pattern = './node_modules/@friends-library/friends/src/en/*.yml';
const friends = glob(pattern).map(path => getFriend(basename(path, '.yml')));

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
  }
`;

export default () => (
  <div id="Slideover" className={element}>
    <h2>Friends</h2>
    <ul>
      {friends.map(friend => (
        <li key={friend.slug}>
          <a href={`/friend/${friend.slug}`}>
            {friend.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
