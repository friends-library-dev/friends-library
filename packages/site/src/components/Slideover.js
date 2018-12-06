// @flow
import * as React from 'react';
import styled from '@emotion/styled';

const Slideover = styled.div`
  z-index: 555;
  background: #eaeaea;
  color: #222;
  padding: 15px;
  font-size: 16px;
  width: 255px;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  transition: left 0.3s ease;
  top: 0;
  left: ${({ isOpen }) => isOpen ? '0' : '-255px'};

  & > ul {
    margin: 0;
    padding-left: 1.5em;
  }

  & .Close {
    position: absolute;
    top: 0.75em;
    right: 0.75em;
    color: #666;
    font-size: 16px;
  }
`;

type Props = {|
  isOpen: boolean,
  close: (any) => *,
|};

export default ({ isOpen, close }: Props) => (
  <Slideover isOpen={isOpen}>
    <i className="Close fa fa-close" onClick={close} />
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
  </Slideover>
);
