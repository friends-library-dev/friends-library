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
const api = new CheckoutApi('/.netlify/functions/site');
const service = new CheckoutService(store.cart, api);
const machine = new CheckoutMachine(service);
machine.on('close', () => store.close());

interface Props {
  isOpen: boolean;
}

const Checkout: React.FC<Props> = ({ isOpen }) => {
  if (!isOpen) return null;

  const data = useStaticQuery(graphql`
    query EmptyCartBooks {
      doc1: document(
        slug: { eq: "no-cross-no-crown" }
        friendSlug: { eq: "william-penn" }
      ) {
        url
        ...CoverProps
      }
      doc2: document(
        slug: { eq: "life-letters" }
        friendSlug: { eq: "samuel-fothergill" }
      ) {
        url
        ...CoverProps
      }
      doc3: document(
        slug: { eq: "vital-religion" }
        friendSlug: { eq: "samuel-rundell" }
      ) {
        url
        ...CoverProps
      }
      doc4: document(
        slug: { eq: "no-cruz-no-corona" }
        friendSlug: { eq: "william-penn" }
      ) {
        url
        ...CoverProps
      }
    }
  `);

  const recommended = Object.values(data)
    .filter(Boolean)
    .map((docData: any) => ({
      Cover: cover3dFromQuery(docData, { scaler: 0.25, scope: '1-4', size: 'm' }),
      title: docData.title,
      path: docData.url,
    }));

  return (
    <CheckoutModal onClose={() => machine.close()}>
      <CheckoutFlow machine={machine} recommendedBooks={recommended} />
    </CheckoutModal>
  );
};

export default Checkout;
