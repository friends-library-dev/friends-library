import React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import { Name, Description } from '@friends-library/types';
import {
  FriendBlock,
  FeaturedQuoteBlock,
  BookByFriend,
  TestimonialsBlock,
  RelatedBookCard,
  MapBlock,
  Heading,
} from '@friends-library/ui';
import { LANG } from '../env';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { Layout } from '../components';
import './FriendPage.css';

interface Props {
  data: {
    relatedDocuments: {
      nodes: (CoverData & {
        id: string;
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

export default ({ data: { friend, relatedDocuments } }: Props) => {
  const isOnlyBook = friend.documents.length === 1;
  const quotes = friend.quotes || [];
  return (
    <Layout>
      <FriendBlock name={friend.name} gender={friend.gender} blurb={friend.description} />
      {quotes.length > 0 && (
        <FeaturedQuoteBlock quote={quotes[0].text} cite={quotes[0].source} />
      )}
      <div className="bg-flgray-100 px-8 pt-12 pb-4 lg:px-8">
        <h2 className="text-xl font-sans text-center tracking-wider font-bold mb-8">
          {friend.isCompilationsQuasiFriend
            ? `All Compilations (${friend.documents.length})`
            : `Books by ${friend.name}`}
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
                {...props}
                isAlone={isOnlyBook}
                className="mb-8 lg:mb-12"
                tags={doc.tags}
                hasAudio={doc.hasAudio}
                bookUrl={doc.url}
                pages={doc.editions[0].pages}
                // @TODO: demand partialDescription vvv
                description={
                  doc.partialDescription ||
                  doc.description
                    .split(' ')
                    .slice(0, 35)
                    .concat(['[...]'])
                    .join(' ')
                }
              />
            );
          })}
        </div>
      </div>
      {!friend.isCompilationsQuasiFriend && (
        <MapBlock
          friendName={friend.name}
          residences={friend.residences.flatMap(r => {
            const place = `${r.city}, ${r.region}`;
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
            label: `${r.city}, ${r.region}`,
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
      {relatedDocuments.nodes.length > 0 && (
        <div className="RelatedBooks bg-flgray-100 p-8">
          <Heading className="mt-2">Related Books</Heading>
          <div className="lg:flex lg:flex-wrap lg:justify-center">
            {relatedDocuments.nodes.map(relatedDoc => {
              const friendDoc = friend.relatedDocuments.find(
                doc => doc.id === relatedDoc.id,
              );
              if (!friendDoc) throw new Error('Missing related doc');
              return (
                <RelatedBookCard
                  key={relatedDoc.editions[0].isbn}
                  className="mb-8 lg:w-1/2 border-flgray-100"
                  lang={LANG}
                  {...relatedDoc}
                  edition={relatedDoc.editions[0].type}
                  isbn={relatedDoc.editions[0].isbn}
                  customCss={relatedDoc.editions[0].code.css.cover || ''}
                  customHtml={relatedDoc.editions[0].code.html.cover || ''}
                  description={friendDoc.description}
                />
              );
            })}
          </div>
        </div>
      )}
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
  }
`;
