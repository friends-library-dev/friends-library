import React from 'react';
import {
  MultiBookBgBlock,
  ExploreNavBlock,
  ExploreUpdatedEditionsBlock,
  ExploreGettingStartedLinkBlock,
  ExploreAudioBooksBlock,
  ExploreNewBooksBlock,
  ExploreTimelineBlock,
  ExploreRegionBlock,
  ExploreSpanishSiteBlock,
  ExploreSearchBlock,
} from '@friends-library/ui';
import { graphql } from 'gatsby';
import { Layout } from '../components';
import { SiteMetadata } from '../types';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { APP_ALT_URL, LANG } from '../env';

export default ({
  data: {
    updatedEditions,
    audioBooks,
    newBooks,
    booksByDate,
    regionBooks,
    searchBooks,
    site,
  },
}: Props) => (
  <Layout>
    <MultiBookBgBlock bright>
      <div className="bg-white text-center py-12 md:py-16 lg:py-20 px-16 my-6 max-w-screen-md mx-auto">
        <h1 className="sans-wider text-3xl mb-6">Explore Books</h1>
        <p className="body-text">
          We currently have{' '}
          {site.meta[LANG === 'en' ? 'numEnglishBooks' : 'numSpanishBooks']} books freely
          available on this site. Overwhelmed? On this page you can browse all the titles
          by edition, region, time period, tags, and more&mdash;or search the full library
          to find exactly what you're looking for.
        </p>
      </div>
    </MultiBookBgBlock>
    <ExploreNavBlock />
    <ExploreUpdatedEditionsBlock
      books={updatedEditions.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreGettingStartedLinkBlock />
    <ExploreAudioBooksBlock
      books={audioBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        documentUrl: data.documentUrl,
      }))}
    />
    <ExploreNewBooksBlock
      books={newBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        documentUrl: data.documentUrl,
        htmlShortTitle: data.htmlShortTitle,
        authorUrl: data.authorUrl,
        badgeText: data.editions[0].badgeText,
        description:
          data.description ||
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      }))}
    />
    <ExploreRegionBlock
      books={regionBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        region: data.region as any,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreTimelineBlock
      books={booksByDate.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        date: data.date,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreSpanishSiteBlock url={APP_ALT_URL} numBooks={site.meta.numSpanishBooks} />
    <ExploreSearchBlock
      books={searchBooks.nodes.flatMap(data =>
        data.editions.map(edition => ({
          ...coverPropsFromQueryData({ ...data, editions: [edition] }),
          htmlShortTitle: data.htmlShortTitle,
          tags: data.tags,
          period: data.period as any,
          region: data.region as any,
          documentUrl: data.documentUrl,
          authorUrl: data.authorUrl,
        })),
      )}
    />
  </Layout>
);

interface Props {
  data: {
    site: SiteMetadata;
    searchBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        tags: string[];
        period: string;
        region: string;
      })[];
    };
    newBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        editions: {
          badgeText: string;
        }[];
        description?: string;
      })[];
    };
    audioBooks: {
      nodes: (CoverData & { documentUrl: string; htmlShortTitle: string })[];
    };
    regionBooks: {
      nodes: (CoverData & {
        authorUrl: string;
        documentUrl: string;
        region: string;
        htmlShortTitle: string;
      })[];
    };
    updatedEditions: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        htmlShortTitle: string;
      })[];
    };
    booksByDate: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        date: number;
        htmlShortTitle: string;
      })[];
    };
  };
}

export const query = graphql`
  query ExplorePage {
    site {
      ...SiteMetadata
    }
    searchBooks: allDocument {
      nodes {
        ...CoverProps
        tags
        period
        authorUrl
        documentUrl: url
        htmlShortTitle
        region
      }
    }
    regionBooks: allDocument(filter: { region: { ne: "Other" } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        authorUrl
        region
      }
    }
    booksByDate: allDocument {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
        date
      }
    }
    newBooks: allDocument(
      sort: { fields: editions___publishedTimestamp, order: DESC }
      limit: 4
    ) {
      nodes {
        ...CoverProps
        editions {
          badgeText: publishedDate
        }
        description: partialDescription
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
      }
    }
    updatedEditions: allDocument(
      filter: { editions: { elemMatch: { type: { eq: "updated" } } } }
    ) {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
  }
`;
