import React from 'react';
import {
  CartStore,
  CheckoutApi,
  CheckoutService,
  CheckoutMachine,
  CheckoutModal,
  CheckoutFlow,
} from '@friends-library/ui';
import ErrorBoundary from './ErrorBoundary';

const store = CartStore.getSingleton();
const api = new CheckoutApi(`/.netlify/functions/site`);
const service = new CheckoutService(store.cart, api);
const machine = new CheckoutMachine(service);
machine.on(`close`, () => store.close());

interface Props {
  isOpen: boolean;
  recommended: {
    Cover: JSX.Element;
    title: string;
    path: string;
  }[];
}

const CheckoutLazy: React.FC<Props> = ({ isOpen, recommended }) => {
  if (!isOpen) return null;
  return (
    <CheckoutModal onClose={() => machine.close()}>
      <ErrorBoundary location="checkout">
        <CheckoutFlow machine={machine} recommendedBooks={recommended} />
      </ErrorBoundary>
    </CheckoutModal>
  );
};

export default CheckoutLazy;
