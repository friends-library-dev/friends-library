import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { cover3dFromQuery } from '../lib/covers';

interface Props {
  isOpen: boolean;
}

const LazyCheckout = React.lazy(() => import(`./CheckoutLazy`));

const Checkout: React.FC<Props> = ({ isOpen }) => {
  const data = useStaticQuery(graphql`
    query EmptyCartBooks {
      doc1: document(
        slug: { eq: "truth-in-the-inward-parts-v1" }
        friendSlug: { eq: "compilations" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
      doc2: document(
        slug: { eq: "walk-in-the-spirit" }
        friendSlug: { eq: "hugh-turford" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
      doc3: document(
        slug: { eq: "writings-volume-1" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
      doc4: document(
        slug: { eq: "verdad-en-lo-intimo" }
        friendSlug: { eq: "compilaciones" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
      doc5: document(
        slug: { eq: "escritos-volumen-1" }
        friendSlug: { eq: "isaac-penington" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
      doc6: document(
        slug: { eq: "no-cruz-no-corona" }
        friendSlug: { eq: "william-penn" }
      ) {
        url
        ...CoverProps
        htmlShortTitle
      }
    }
  `);

  if (!isOpen || typeof window === `undefined`) return null;

  const recommended = Object.values(data)
    .filter(Boolean)
    .map((docData: any) => ({
      Cover: cover3dFromQuery(docData, { scaler: 0.25, scope: `1-4`, size: `m` }),
      title: docData.htmlShortTitle,
      path: docData.url,
    }));

  return (
    <React.Suspense fallback={<div />}>
      <LazyCheckout isOpen={isOpen} recommended={recommended} />
    </React.Suspense>
  );
};

export default Checkout;
