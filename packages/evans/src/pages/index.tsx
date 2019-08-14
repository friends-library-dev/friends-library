import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import Layout from '../components/Layout';
import TempBlock from '../components/TempBlock';
import Button from '../components/Button';
import { WhoWereTheQuakers, Hero } from '@friends-library/ui';

const featured = css`
  background: #eaeaea;
  padding: 1px 0.6em 0.5em 0.6em;
  margin-bottom: 1em;
  border-radius: 5px;

  > h2 {
    font-size: 16px;
    font-style: italic;
    text-align: center;
    margin: 10px 0 0;
  }

  > p {
    line-height: 1.3em;
    font-size: 0.9em;
    margin-top: 10px;
  }
`;

export default () => (
  <Layout>
    <Hero />
    <TempBlock alt>
      <h1>Featured Books</h1>
      <div css={featured}>
        <h2>Truth in the Inward Parts</h2>
        <p>
          This book is a collection of autobigraphical extracts taken from the journals
          and letters of ten early Quakers detailing the struggles, spiritual growth, and
          inward transformation of the early years of their discipleship.{' '}
          <Link to="/">Read now &raquo;</Link>
        </p>
      </div>
      <div css={featured}>
        <h2>Penington's Writings, volume 1</h2>
        <p>
          Isaac Penington was an eminent writer a great sufferer for the cause of truth in
          his day. His writings have been justly treasured by for their incredible depth,
          wisdom, and usefulness to the Christian traveller.{' '}
          <Link to="/isaac-penington/writings-volume-1">Read now &raquo;</Link>
        </p>
      </div>
      <div css={featured}>
        <h2>Saved to the Uttermost</h2>
        <p>
          This book contains a wonderfully clear presentation of some of the distinctive
          principles and doctrines of the Society of Friends, including the fall of man,
          redemption, justification, and perfection.{' '}
          <Link to="/robert-barclay/saved-to-the-uttermost">Read now &raquo;</Link>
        </p>
      </div>
    </TempBlock>
    <TempBlock>
      <h1>Getting Started</h1>
      <p>
        Not sure where to begin? We've got a bunch recommendations adapted to various
        states and interests to help guide you.
      </p>
      <Button url="/getting-started" text="Getting Started &raquo;" />
    </TempBlock>
    <WhoWereTheQuakers />
    <TempBlock>
      <h1>Formats and Editions</h1>
      <p>
        On this site you will find many books available in multiple formats. Our desire is
        to make these precious writings as accessible as possible to the modern seeker
        after truth. Therefore, each book has been converted to 3 digital formats:{' '}
        <code>pdf</code>, <code>mobi</code> (for Kindle), and <code>epub</code> (all other
        e-readers including iBooks). A growing number of our books also have a free audio
        version, and some are also available in a paperback edition.
      </p>
      <p>
        In addition to the various formats of the book, we also offer minimally and
        carefully modernized versions of each book, because most modern readers find some
        of the antiquated grammer and vocabulary to be a stumbling block to comprehension.
        For more info on modernization, <Link to="/modernization">click here</Link>.
      </p>
    </TempBlock>
    <TempBlock alt>
      <h1>Explore Books</h1>
      <p>
        We currently have 113 books freely availble on this site. We'll help you find what
        you're looking for by searching, browsing authors, topics, genres, and more.
      </p>
      <Button url="/explore" text="Explore Books &raquo;" />
    </TempBlock>
  </Layout>
);
