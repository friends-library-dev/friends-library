import React from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject, FluidImageObject } from '@friends-library/types';
import Layout from '../components/Layout';
import ExploreBooksBlock from '../components/ExploreBooksBlock';
import { LANG } from '../env';
import { SiteMetadata } from '../types';
import {
  HomeWhoWereTheQuakersBlock,
  HomeHeroBlock,
  HomeSubHeroBlock,
  HomeGettingStartedBlock,
  HomeFeaturedBooksBlock,
  HomeFormatsBlock,
} from '@friends-library/ui';
import { coverPropsFromQueryData } from '../lib/covers';

const HomePage: React.FC<Props> = ({ data }) => {
  const {
    site,
    london,
    deviceArray,
    paperback,
    iPad,
    iPhone,
    formats,
    formatsMobile,
    ...featured
  } = data;
  const numBooks = site.meta[LANG === `en` ? `numEnglishBooks` : `numSpanishBooks`];
  return (
    <Layout>
      <HomeHeroBlock />
      <HomeSubHeroBlock
        imgDeviceArray={deviceArray.image.fluid}
        imgCover={paperback.image.fluid}
        imgIPad={iPad.image.fluid}
        imgIPhone={iPhone.image.fluid}
        numTotalBooks={numBooks}
      />
      <HomeFeaturedBooksBlock
        books={Object.values(featured)
          .filter(Boolean)
          .map((doc: any) => ({
            ...coverPropsFromQueryData(doc),
            featuredDesc: doc.featuredDesc,
            documentUrl: doc.url,
            authorUrl: doc.authorUrl,
            htmlShortTitle: doc.htmlShortTitle,
          }))}
      />
      <HomeGettingStartedBlock />
      <HomeWhoWereTheQuakersBlock bgImg={london.image.fluid} />
      <HomeFormatsBlock img={formats.image.fluid} imgMobile={formatsMobile.image.fluid} />
      <ExploreBooksBlock numTotalBooks={numBooks} />
    </Layout>
  );
};

export default HomePage;

interface Props {
  data: {
    site: SiteMetadata;
    en_titip: any | null;
    en_turford: any | null;
    en_ip_1: any | null;
    en_ip_2: any | null;
    en_penn_ncnc: any | null;
    es_titip: any | null;
    es_ip_1: any | null;
    es_ip_2: any | null;
    es_penn_ncnc: any | null;
    london: { image: { fluid: FluidBgImageObject } };
    deviceArray: { image: { fluid: FluidImageObject } };
    iPad: { image: { fluid: FluidImageObject } };
    iPhone: { image: { fluid: FluidImageObject } };
    paperback: { image: { fluid: FluidImageObject } };
    formats: { image: { fluid: FluidImageObject } };
    formatsMobile: { image: { fluid: FluidImageObject } };
  };
}

export const query = graphql`
  query HomePage {
    site {
      ...SiteMetadata
    }
    en_titip: document(
      slug: { eq: "truth-in-the-inward-parts" }
      friendSlug: { eq: "compilations" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    en_turford: document(
      slug: { eq: "walk-in-the-spirit" }
      friendSlug: { eq: "hugh-turford" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    en_ip_1: document(
      slug: { eq: "writings-volume-1" }
      friendSlug: { eq: "isaac-penington" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    en_ip_2: document(
      slug: { eq: "writings-volume-2" }
      friendSlug: { eq: "isaac-penington" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    en_penn_ncnc: document(
      slug: { eq: "no-cross-no-crown" }
      friendSlug: { eq: "william-penn" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    es_titip: document(
      slug: { eq: "verdad-en-lo-intimo" }
      friendSlug: { eq: "compilaciones" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    es_ip_1: document(
      slug: { eq: "escritos-volumen-1" }
      friendSlug: { eq: "isaac-penington" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    es_ip_2: document(
      slug: { eq: "escritos-volumen-2" }
      friendSlug: { eq: "isaac-penington" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    es_penn_ncnc: document(
      slug: { eq: "no-cruz-no-corona" }
      friendSlug: { eq: "william-penn" }
    ) {
      ...RecommendedBook
      featuredDesc: featuredDescription
    }
    london: file(relativePath: { eq: "london.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    deviceArray: file(relativePath: { eq: "device-array.png" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    paperback: file(relativePath: { eq: "samuel-fothergill-cover.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 440) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    iPhone: file(relativePath: { eq: "iphone.png" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 700) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    iPad: file(relativePath: { eq: "ipad.png" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    formats: file(relativePath: { eq: "formats-books.png" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 867) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    formatsMobile: file(relativePath: { eq: "formats-books-mobile.png" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 586) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
