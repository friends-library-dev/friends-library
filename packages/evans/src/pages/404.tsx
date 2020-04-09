import React from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import {
  HomeGettingStartedBlock,
  ExploreAltSiteBlock,
  NotFoundHeroBlock,
} from '@friends-library/ui';
import Layout from '../components/Layout';
import ExploreBooksBlock from '../components/ExploreBooksBlock';
import { APP_ALT_URL, LANG } from '../env';
import { SiteMetadata } from '../types';

interface Props {
  data: {
    site: SiteMetadata;
    sheep: { image: { fluid: FluidBgImageObject } };
  };
}

const NotFoundPage: React.FC<Props> = ({ data: { site, sheep } }) => {
  const numBooks = site.meta[LANG === 'en' ? 'numEnglishBooks' : 'numSpanishBooks'];
  const numAltBooks = site.meta[LANG === 'es' ? 'numEnglishBooks' : 'numSpanishBooks'];
  return (
    <Layout>
      <NotFoundHeroBlock bgImg={sheep.image.fluid} />
      <HomeGettingStartedBlock />
      <ExploreAltSiteBlock url={APP_ALT_URL} numBooks={numAltBooks} />
      <ExploreBooksBlock numTotalBooks={numBooks} />
    </Layout>
  );
};

export default NotFoundPage;

export const query = graphql`
  query NotFound {
    site {
      ...SiteMetadata
    }
    sheep: file(relativePath: { eq: "sheep.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 2600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
