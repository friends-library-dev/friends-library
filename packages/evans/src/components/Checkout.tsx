import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import {
  CartStore,
  CheckoutApi,
  CheckoutService,
  CheckoutMachine,
  CheckoutModal,
  CheckoutFlow,
} from '@friends-library/ui';
import { cover3dFromQuery } from '../lib/covers';

const store = CartStore.getSingleton();
const api = new CheckoutApi(`/.netlify/functions/site`);
const service = new CheckoutService(store.cart, api);
const machine = new CheckoutMachine(service);
machine.on(`close`, () => store.close());

interface Props {
  isOpen: boolean;
}

const Checkout: React.FC<Props> = ({ isOpen }) => {
  const data = useStaticQuery(graphql`
    query EmptyCartBooks {
      doc1: document(
        slug: { eq: "truth-in-the-inward-parts" }
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

  if (!isOpen) return null;

  const recommended = Object.values(data)
    .filter(Boolean)
    .map((docData: any) => ({
      Cover: cover3dFromQuery(docData, { scaler: 0.25, scope: `1-4`, size: `m` }),
      title: docData.htmlShortTitle,
      path: docData.url,
    }));

  return (
    <CheckoutModal onClose={() => machine.close()}>
      <CheckoutFlow machine={machine} recommendedBooks={recommended} />
    </CheckoutModal>
  );
};

export default Checkout;
