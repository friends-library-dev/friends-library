import React from 'react';
import Layout from '../components/Layout';
import {
  WhoWereTheQuakers,
  Hero,
  SubHero,
  GettingStarted,
  ExploreBooks,
  FeaturedBooks,
  Formats,
} from '@friends-library/ui';

export default () => (
  <Layout>
    <Hero />
    <SubHero />
    <FeaturedBooks />
    <GettingStarted />
    <WhoWereTheQuakers />
    <Formats />
    <ExploreBooks />
  </Layout>
);
