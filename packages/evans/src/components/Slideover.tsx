import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

const Slideover = styled.div<{ isOpen: boolean }>`
  z-index: 555;
  background: #eaeaea;
  color: #222;
  padding: 15px;
  font-size: 16px;
  width: 255px;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: fixed;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'none' : 'translate3d(-100%, 0, 0)')};

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

interface Props {
  isOpen: boolean;
  close: () => void;
}

export default ({ isOpen, close }: Props) => (
  <Slideover isOpen={isOpen}>
    <i className="Close fa fa-close" onClick={close} />
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
  </Slideover>
);
