// @flow
import * as React from 'react';
import { css } from 'glamor';
import { sync as glob } from 'glob';
import { basename } from 'path';
import { getFriend } from 'server/helpers';

const pattern = './node_modules/@friends-library/friends/src/en/*.yml';
const friends = glob(pattern).map(path => getFriend(basename(path, '.yml')));

const element = css`
  > h2 {
    margin-top: 5px;
  }
  > h2 > span {
    font-size: 55%;
    opacity: 0.8;
  }
`;

export default () => (
  <div className={element}>
    <h2>Friends <span>({friends.length})</span></h2>
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
