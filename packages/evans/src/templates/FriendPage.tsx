import React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import { Name, Description, FluidBgImageObject } from '@friends-library/types';
import {
  t,
  translate,
  FriendBlock,
  FeaturedQuoteBlock,
  BookByFriend,
  TestimonialsBlock,
  BookTeaserCards,
  MapBlock,
} from '@friends-library/ui';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { Layout, Seo } from '../components';
import './FriendPage.css';

interface Props {
  data: {
    booksBg: { image: { fluid: FluidBgImageObject } };
    relatedDocuments: {
      nodes: (CoverData & {
        id: string;
        htmlShortTitle: string;
        documentUrl: string;
        authorUrl: string;
      })[];
    };
    friend: {
      gender: 'male' | 'female';
      isCompilationsQuasiFriend: boolean;
      name: Name;
      born: number | undefined;
      died: number | undefined;
      description: Description;
      documents: (CoverData & {
        htmlShortTitle: string;
        tags: string[];
        url: string;
        hasAudio: boolean;
        partialDescription?: string;
        description: string;
      })[];
      quotes?: { source: string; text: string }[];
      relatedDocuments: { id: string; description: string }[];
      residences: {
        city: string;
        region: string;
        top: number;
        left: number;
        map: 'UK' | 'US' | 'Europe';
        durations?: {
          start: number;
          end: number;
        }[];
      }[];
    };
  };
}

export default ({ data: { friend, relatedDocuments, booksBg } }: Props) => {
  const isOnlyBook = friend.documents.length === 1;
  const quotes = friend.quotes || [];
  return (
    <Layout>
      <Seo title={friend.name} />
      <FriendBlock name={friend.name} gender={friend.gender} blurb={friend.description} />
      {quotes.length > 0 && (
        <FeaturedQuoteBlock quote={quotes[0].text} cite={quotes[0].source} />
      )}
      <div className="bg-flgray-100 px-8 pt-12 pb-4 lg:px-8">
        <h2 className="text-xl font-sans text-center tracking-wider font-bold mb-8">
          {friend.isCompilationsQuasiFriend
            ? t`All Compilations (${friend.documents.length})`
            : t`Books by ${friend.name}`}
        </h2>
        <div
          className={cx('flex flex-col items-center ', 'xl:justify-center', {
            'lg:flex-row lg:justify-between lg:flex-wrap lg:items-stretch': !isOnlyBook,
          })}
        >
          {friend.documents.map(doc => {
            const props = coverPropsFromQueryData(doc);
            return (
              <BookByFriend
                key={doc.url}
                htmlShortTitle={doc.htmlShortTitle}
                {...props}
                isAlone={isOnlyBook}
                className="mb-8 lg:mb-12"
                tags={doc.tags}
                hasAudio={doc.hasAudio}
                bookUrl={doc.url}
                pages={doc.editions[0].pages}
                description={doc.partialDescription || ''}
              />
            );
          })}
        </div>
      </div>
      {!friend.isCompilationsQuasiFriend && (
        <MapBlock
          bgImg={booksBg.image.fluid}
          friendName={friend.name}
          residences={friend.residences.flatMap(r => {
            const place = `${translate(r.city)}, ${translate(r.region)}`;
            if (r.durations) {
              return r.durations.map(d => `${place} (${d.start} - ${d.end})`);
            }
            let residence = place;
            if (friend.born && friend.died) {
              residence += ` (${friend.born} - ${friend.died})`;
            } else if (friend.died) {
              residence += ` (died: ${friend.died})`;
            }
            return residence;
          })}
          map={friend.residences[0].map}
          markers={friend.residences.map(r => ({
            label: `${translate(r.city)}, ${translate(r.region)}`,
            top: r.top,
            left: r.left,
          }))}
        />
      )}
      {quotes.length > 1 && (
        <TestimonialsBlock
          testimonials={quotes.slice(1).map(q => ({ cite: q.source, quote: q.text }))}
        />
      )}
      <BookTeaserCards
        bgColor="flgray-100"
        titleTextColor="flblack"
        title={t`Related Books`}
        titleEl="h3"
        books={relatedDocuments.nodes.map(relatedDoc => {
          const friendDoc = friend.relatedDocuments.find(doc => doc.id === relatedDoc.id);
          if (!friendDoc) throw new Error('Missing related doc');
          return {
            ...relatedDoc,
            ...coverPropsFromQueryData(relatedDoc),
            description: friendDoc.description,
          };
        })}
      />
    </Layout>
  );
};

export const query = graphql`
  query GetFriend($slug: String!, $relatedDocumentIds: [String!]!) {
    relatedDocuments: allDocument(filter: { documentId: { in: $relatedDocumentIds } }) {
      nodes {
        ...CoverProps
        id: documentId
        documentUrl: url
        htmlShortTitle
        authorUrl
      }
    }
    friend(slug: { eq: $slug }) {
      name
      gender
      isCompilationsQuasiFriend
      description
      quotes {
        source
        text
      }
      relatedDocuments {
        id
        description
      }
      born
      died
      documents: childrenDocument {
        ...CoverProps
        slug
        title
        hasAudio
        tags
        url
        partialDescription
        description
        htmlShortTitle
      }
      residences {
        city
        region
        map
        top
        left
        durations {
          start
          end
        }
      }
    }
    booksBg: file(relativePath: { eq: "Books7.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
