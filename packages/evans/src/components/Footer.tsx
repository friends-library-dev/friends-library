import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import Block from './Block';

const element = css`
  background-color: #444;
  color: #fff;
  margin-top: auto;

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
  <Block css={element}>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/getting-started">Getting started</Link>
      </li>
      <li>
        <Link to="/explore">Explore books</Link>
      </li>
      <li>
        <Link to="/audiobooks">Audiobooks</Link>
      </li>
      <li>
        <Link to="/friends">All Friends</Link>
      </li>
      <li>
        <Link to="/quakers">About the Quakers</Link>
      </li>
      <li>
        <Link to="/modernization">About modernization</Link>
      </li>
      <li>
        <Link to="/editions">About book editions</Link>
      </li>
      <li>
        <Link to="/about">About this site</Link>
      </li>
      <li>
        <Link to="/audio-help">Audio help</Link>
      </li>
      <li>
        <Link to="/ebook-help">E-book help</Link>
      </li>
      <li>
        <Link to="/contact">Contact us</Link>
      </li>
    </ul>

    <p>&copy; 2018 The Friends Library</p>
  </Block>
);
