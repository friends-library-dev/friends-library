// @flow
import * as React from 'react';
import { css } from 'glamor';
import { t } from 'c-3po';
import { sync as glob } from 'glob';
import { LANG } from 'env';
import { basename } from 'path';
import url from 'lib/url';
import { getFriend } from 'server/helpers';

const pattern = `./node_modules/@friends-library/friends/src/${LANG}/*.yml`;
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
    <h2>{t`Friends`} <span>({friends.length})</span></h2>
    <ul>
      {friends.map(friend => (
        <li key={friend.slug}>
          <a href={url(friend)}>
            {friend.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
