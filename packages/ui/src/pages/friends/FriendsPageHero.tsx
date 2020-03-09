import React from 'react';
import { makeScroller } from '../../lib/scroll';
import './FriendsPageHero.css';

const FriendsPageHero: React.FC<{ numFriends: number }> = ({ numFriends }) => (
  <div className="FriendsPageHero text-center text-white px-16 py-16 md:py-24 xl:py-32">
    <h1 className="sans-wider text-4xl font-bold">Authors</h1>
    <p className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      Friends Library currently contains books written by{' '}
      <span className="font-bold">{numFriends}</span> early Friends, and more authors are
      being added regularly. Check out our recently-added authors, or browse the full list
      below. You can also{' '}
      <a
        href="#ControlsBlock"
        className="underline"
        onClick={e => {
          e.preventDefault();
          makeScroller('#ControlsBlock')();
        }}
      >
        sort
      </a>{' '}
      and{' '}
      <a
        href="#ControlsBlock"
        className="underline"
        onClick={e => {
          e.preventDefault();
          makeScroller('#ControlsBlock')();
        }}
      >
        search
      </a>{' '}
      to find exactly who you&rsquo;re looking for.
    </p>
  </div>
);

export default FriendsPageHero;
