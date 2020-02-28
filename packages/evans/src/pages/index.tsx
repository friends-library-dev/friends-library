import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import { LANG } from '../env';
import { SiteMetadata } from '../types';
import {
  HomeWhoWereTheQuakersBlock,
  HomeHeroBlock,
  HomeSubHeroBlock,
  HomeGettingStartedBlock,
  HomeExploreBooksBlock,
  HomeFeaturedBooksBlock,
  HomeFormatsBlock,
} from '@friends-library/ui';

const HomePage: React.FC<Props> = ({ data: { site } }) => {
  const numBooks = site.meta[LANG === 'en' ? 'numEnglishBooks' : 'numSpanishBooks'];
  return (
    <Layout>
      <HomeHeroBlock />
      <HomeSubHeroBlock numTotalBooks={numBooks} />
      <HomeFeaturedBooksBlock />
      <HomeGettingStartedBlock />
      <HomeWhoWereTheQuakersBlock />
      <HomeFormatsBlock />
      <HomeExploreBooksBlock numTotalBooks={numBooks} />
    </Layout>
  );
};

export default HomePage;

interface Props {
  data: { site: SiteMetadata };
}

export const query = graphql`
  query HomePage {
    site {
      ...SiteMetadata
    }
  }
`;
