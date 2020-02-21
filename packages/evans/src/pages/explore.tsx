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
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { APP_ALT_URL } from '../env';

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
          Here's the intro text to the new explore books page. We have 200 books that
          explores a variety of topcs about the Friends Library. From journals, to
          required reading, here you'll find the entire collection to browse and explore
        </p>
      </div>
    </MultiBookBgBlock>
    <ExploreNavBlock />
    <ExploreUpdatedEditionsBlock
      books={updatedEditions.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreGettingStartedLinkBlock />
    <ExploreAudioBooksBlock
      books={audioBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        documentUrl: data.documentUrl,
      }))}
    />
    <ExploreNewBooksBlock
      books={newBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
        badgeText: data.badgeText,
        description:
          data.description ||
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      }))}
    />
    <ExploreRegionBlock
      books={regionBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        region: data.region as any,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreTimelineBlock
      books={booksByDate.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        date: data.date,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreSpanishSiteBlock url={APP_ALT_URL} numBooks={site.meta.numSpanishBooks} />
    <ExploreSearchBlock
      books={searchBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        tags: data.tags,
        period: data.period as any,
        region: data.region as any,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
  </Layout>
);

interface Props {
  data: {
    site: { meta: { numSpanishBooks: number } };
    searchBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        tags: string[];
        period: string;
        region: string;
      })[];
    };
    newBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        badgeText: string;
        description?: string;
      })[];
    };
    audioBooks: {
      nodes: (CoverData & { documentUrl: string })[];
    };
    regionBooks: {
      nodes: (CoverData & { authorUrl: string; documentUrl: string; region: string })[];
    };
    updatedEditions: {
      nodes: (CoverData & { documentUrl: string; authorUrl: string })[];
    };
    booksByDate: {
      nodes: (CoverData & { documentUrl: string; authorUrl: string; date: number })[];
    };
  };
}

export const query = graphql`
  query ExplorePage {
    site {
      meta: siteMetadata {
        numSpanishBooks
      }
    }
    searchBooks: allDocument {
      nodes {
        ...CoverProps
        tags
        period
        authorUrl
        documentUrl: url
        region
      }
    }
    regionBooks: allDocument {
      nodes {
        ...CoverProps
        documentUrl: url
        region
      }
    }
    booksByDate: allDocument {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        date
      }
    }
    newBooks: allDocument(sort: { fields: addedTimestamp, order: DESC }, limit: 4) {
      nodes {
        ...CoverProps
        badgeText: addedDate
        description: partialDescription
        authorUrl
        documentUrl: url
      }
    }
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
      }
    }
    updatedEditions: allDocument(
      filter: { editions: { elemMatch: { type: { eq: "updated" } } } }
    ) {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
      }
    }
  }
`;
