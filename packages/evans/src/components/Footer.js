// @flow
import * as React from 'react';
import { css } from 'glamor';
import Block from './Block';

const element = css`
  background-color: #444;
  color: #fff;

  > ul {
    list-style: none;
    padding: 0 0 0 15px;
  }

  > ul > li {
    margin: 7px 0;
  }

  > ul > li > a {
    color: #fff;
  }

  & p {
    text-align: center;
    font-style: italic;
    color: #bbb;
    margin: 0;
    font-size: 0.8em;
  }
`;

export default () => (
  <Block className={element}>
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/getting-started">Getting started</a>
      </li>
      <li>
        <a href="/explore">Explore books</a>
      </li>
      <li>
        <a href="/audiobooks">Audiobooks</a>
      </li>
      <li>
        <a href="/paperbacks">Paperpacks</a>
      </li>
      <li>
        <a href="/friends">All Friends</a>
      </li>
      <li>
        <a href="/quakers">About the Quakers</a>
      </li>
      <li>
        <a href="/modernization">About modernization</a>
      </li>
      <li>
        <a href="/editions">About book editions</a>
      </li>
      <li>
        <a href="/about">About this site</a>
      </li>
      <li>
        <a href="/audio-help">Audio help</a>
      </li>
      <li>
        <a href="/ebook-help">E-book help</a>
      </li>
      <li>
        <a href="/contact">Contact us</a>
      </li>
    </ul>

    <p>&copy; 2018 The Friends Library</p>
  </Block>
);
