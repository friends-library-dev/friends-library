import React from 'react';
import { graphql } from 'gatsby';
import {
  HomeExploreBooksBlock,
  HomeGettingStartedBlock,
  ExploreSpanishSiteBlock,
  NotFoundHeroBlock,
} from '@friends-library/ui';
import Layout from '../components/Layout';
import { APP_ALT_URL, LANG } from '../env';
import { SiteMetadata } from '../types';

interface Props {
  data: { site: SiteMetadata };
}

const NotFoundPage: React.FC<Props> = ({ data: { site } }) => {
  const numBooks = site.meta[LANG === 'en' ? 'numEnglishBooks' : 'numSpanishBooks'];
  return (
    <Layout>
      <NotFoundHeroBlock />
      <HomeGettingStartedBlock />
      {LANG === 'en' && (
        <ExploreSpanishSiteBlock url={APP_ALT_URL} numBooks={site.meta.numSpanishBooks} />
      )}
      <HomeExploreBooksBlock numTotalBooks={numBooks} />
    </Layout>
  );
};

export default NotFoundPage;
export const query = graphql`
  query NotFound {
    site {
      ...SiteMetadata
    }
  }
`;
