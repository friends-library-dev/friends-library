// @flow
import * as React from 'react';
import { css } from 'glamor';
import { sync as glob } from 'glob';
import { getFriend } from 'server/helpers';
import url from 'lib/url';
import { LANG } from 'env';
import { basename } from 'path';
import { t } from 'c-3po';

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

  & > h2 > span {
    font-size: 55%;
  }
`;

const pattern = `./node_modules/@friends-library/friends/src/${LANG}/*.yml`;
const friends = glob(pattern).map(path => getFriend(basename(path, '.yml')));

export default () => (
  <div id="Slideover" className={element}>
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
