import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { PathBlock } from '@friends-library/ui';
import { coverPropsFromQueryData } from '../lib/covers';

interface Props {
  HistoryBlurb: React.FC;
  JournalsBlurb: React.FC;
  DevotionalBlurb: React.FC;
  DoctrineBlurb: React.FC;
}

const GettingStartedPaths: React.FC<Props> = ({
  HistoryBlurb,
  DoctrineBlurb,
  DevotionalBlurb,
  JournalsBlurb,
}) => {
  const data = useStaticQuery(graphql`
    query PathBooks {
      doc1: document(
        slug: { eq: "no-cross-no-crown" }
        friendSlug: { eq: "william-penn" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc2: document(
        slug: { eq: "life-letters" }
        friendSlug: { eq: "samuel-fothergill" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc3: document(slug: { eq: "journal" }, friendSlug: { eq: "george-fox" }) {
        url
        authorUrl
        ...CoverProps
      }
      doc4: document(
        slug: { eq: "walk-in-the-spirit" }
        friendSlug: { eq: "hugh-turford" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc5: document(
        slug: { eq: "no-cruz-no-corona" }
        friendSlug: { eq: "william-penn" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc6: document(
        slug: { eq: "escritos-volumen-1" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc7: document(
        slug: { eq: "esta-grande-salvacion" }
        friendSlug: { eq: "robert-barclay" }
      ) {
        url
        authorUrl
        ...CoverProps
      }
      doc8: document(slug: { eq: "vida" }, friendSlug: { eq: "james-parnell" }) {
        url
        authorUrl
        ...CoverProps
      }
    }
  `);
  const books = Object.values(data)
    .filter(Boolean)
    .map((doc: any) => ({
      ...coverPropsFromQueryData(doc),
      size: 's' as const,
      documentUrl: doc.url,
      authorUrl: doc.authorUrl,
    }));

  return (
    <>
      <PathBlock title="History of the Quakers" books={books} color="maroon">
        <HistoryBlurb />
      </PathBlock>
      <PathBlock title="The Quaker Doctrine" books={books} color="blue">
        <DoctrineBlurb />
      </PathBlock>
      <PathBlock title="Devotional" books={books} color="green">
        <DevotionalBlurb />
      </PathBlock>
      <PathBlock title="Journals" books={books} color="gold">
        <JournalsBlurb />
      </PathBlock>
    </>
  );
};

export default GettingStartedPaths;
