import React from 'react';
import Layout from '../components/Layout';
import {
  WhoWereTheQuakers,
  Hero,
  SubHero,
  GettingStartedBlock,
  ExploreBooksBlock,
  FeaturedBooks,
  Formats,
} from '@friends-library/ui';

export default () => (
  <Layout>
    <Hero />
    <SubHero />
    <FeaturedBooks />
    <GettingStartedBlock />
    <WhoWereTheQuakers />
    <Formats />
    <ExploreBooksBlock />
  </Layout>
);
