import React, { useState, useEffect } from 'react';
import { Address, CartItem } from './types';
import CheckoutMachine from './CheckoutMachine';
import Cart from '../cart';
import CostExplanation from './CostExplanation';
import CollectEmail from './CollectEmail';
import CollectAddress from './CollectAddress';
import MessageThrobber from './MessageThrobber';
import ConfirmShipping from './ConfirmShipping';
import CollectCreditCard from './CollectCreditCard';
import Success from './Success';

const CheckoutFlow: React.FC<{ machine: CheckoutMachine; cart: CartItem[] }> = ({
  machine,
  cart,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(cart);
  const [shipping, setShipping] = useState<number | null>(null);
  const [state, setState] = useState<string>(machine.getState());
  const [, setEmail] = useState<string>('');
  const [, setAddress] = useState<Address | null>(null);
  useEffect(() => machine.listen(newState => setState(newState)), []);

  switch (state) {
    case 'cart':
      return (
        <Cart
          items={cartItems}
          setItems={setCartItems}
          checkout={() => machine.dispatch('next')}
          close={() => {}}
        />
      );
    case 'costExplanation':
      return <CostExplanation onGotIt={() => machine.dispatch('next')} />;
    case 'collectEmail':
      return (
        <CollectEmail
          onSubmit={email => {
            setEmail(email);
            machine.dispatch('next');
          }}
        />
      );
    case 'collectAddress':
      return (
        <CollectAddress
          onSubmit={collectedAddress => {
            setAddress(collectedAddress);
            machine.dispatch('next', {
              address: collectedAddress,
              cart: cartItems,
              setShipping,
            });
          }}
        />
      );
    case 'calculatingShipping':
      return <MessageThrobber msg="Calculating exact shipping cost..." />;
    case 'authorizingPayment':
      return <MessageThrobber msg="Pre-authorizing credit card payment..." />;
    case 'submittingToPrinter':
      return (
        <MessageThrobber msg="Payment pre-authorized. Submitting order to printer..." />
      );
    case 'validatingPrintOrder':
      return (
        <MessageThrobber msg="Order submitted. Waiting for print order validation..." />
      );
    case 'capturingPayment':
      return <MessageThrobber msg="Order validated. Charging your credit card..." />;
    case 'confirmShipping':
      return (
        <ConfirmShipping
          onConfirm={() => machine.dispatch('next')}
          onBackToCart={() => machine.dispatch('backToCart')}
          subTotal={cartItems.reduce((st, i) => st + i.price * i.quantity, 0)}
          shipping={shipping as number}
        />
      );
    case 'collectCreditCart':
      return <CollectCreditCard onPay={() => machine.dispatch('next')} />;
    case 'success':
      return <Success onClose={() => {}} />;
    default:
      return <p>not cart</p>;
  }
};

export default CheckoutFlow;
