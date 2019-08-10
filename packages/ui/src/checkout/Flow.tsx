import React, { useState, useEffect } from 'react';
import CheckoutMachine from './services/CheckoutMachine';
import Cart from '../cart';
import CostExplanation from './CostExplanation';
import CollectEmail from './CollectEmail';
import CollectAddress from './CollectAddress';
import MessageThrobber from './MessageThrobber';
import ConfirmFees from './ConfirmFees';
import CollectCreditCard from './CollectCreditCard';
import Success from './Success';
import CartItem, { CartItemData } from './models/CartItem';

const CheckoutFlow: React.FC<{ machine: CheckoutMachine }> = ({ machine }) => {
  const [cartItems, setCartItems] = useState<CartItemData[]>(
    machine.cart.items.map(i => i.toJSON()),
  );
  const [state, setState] = useState<string>(machine.getState());
  useEffect(() => machine.listen(newState => setState(newState)), []);

  switch (state) {
    case 'cart':
      return (
        <Cart
          items={cartItems}
          setItems={items => {
            machine.cart.items = items.map(i => new CartItem(i));
            setCartItems(items);
          }}
          subTotal={machine.cart.subTotal()}
          checkout={() => machine.dispatch('next')}
          close={() => {}}
        />
      );
    case 'costExplanation':
      return <CostExplanation onGotIt={() => machine.dispatch('next')} />;
    case 'collectEmail':
      return (
        <CollectEmail
          stored={machine.cart.email || ''}
          onSubmit={email => {
            machine.cart.email = email;
            machine.dispatch('next');
          }}
        />
      );
    case 'collectAddress':
      return (
        <CollectAddress
          stored={machine.cart.address}
          onSubmit={collectedAddress => {
            machine.cart.address = collectedAddress;
            machine.dispatch('next');
          }}
        />
      );
    case 'calculatingFees':
      return <MessageThrobber msg="Calculating exact shipping cost and fees..." />;
    case 'fetchingPaymentToken':
    case 'authorizingPayment':
      return <MessageThrobber msg="Pre-authorizing credit card payment..." />;
    case 'submittingToPrinter':
      return (
        <MessageThrobber msg="Payment pre-authorized. Submitting order to printer..." />
      );
    case 'validatingPrintOrder':
    case 'updateOrderPrintJobStatus':
      return (
        <MessageThrobber msg="Order submitted. Waiting for print order validation..." />
      );
    case 'capturingPayment':
      return <MessageThrobber msg="Order validated. Charging your credit card..." />;
    case 'confirmFees':
      return (
        <ConfirmFees
          onConfirm={() => machine.dispatch('next')}
          onBackToCart={() => machine.dispatch('backToCart')}
          subTotal={machine.cart.subTotal()}
          shipping={machine.service.fees.shipping}
        />
      );
    case 'collectCreditCart':
      return <CollectCreditCard onPay={getToken => machine.dispatch('next', getToken)} />;
    case 'success':
      return <Success email={machine.cart.email || ''} onClose={() => {}} />;
    default:
      return <p>not cart</p>;
  }
};

export default CheckoutFlow;
