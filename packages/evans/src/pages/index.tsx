import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import TempBlock from '../components/TempBlock';
import {
  WhoWereTheQuakers,
  Hero,
  SubHero,
  GettingStarted,
  ExploreBooks,
  FeaturedBooks,
} from '@friends-library/ui';

export default () => (
  <Layout>
    <Hero />
    <SubHero />
    <FeaturedBooks />
    <GettingStarted />
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
    <ExploreBooks />
  </Layout>
);
