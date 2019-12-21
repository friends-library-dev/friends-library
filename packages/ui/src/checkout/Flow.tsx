import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutMachine from './services/CheckoutMachine';
import Cart from '../cart';
import Delivery from './Delivery';
import Payment from './Payment';
import Confirmation from './Confirmation';
import UnrecoverableError from './UnrecoverableError';
import CartItem, { CartItemData } from './models/CartItem';

const CheckoutFlow: React.FC<{ machine: CheckoutMachine }> = ({ machine }) => {
  const [cartItems, setCartItems] = useState<CartItemData[]>(
    machine.service.cart.items.map(i => i.toJSON()),
  );
  const [state, setState] = useState<string>(machine.getState());
  useEffect(() => machine.listen(newState => setState(newState)), []);

  switch (state) {
    case 'cart':
      return (
        <Cart
          items={cartItems}
          setItems={items => {
            machine.service.cart.items = items.map(i => new CartItem(i));
            setCartItems(items);
          }}
          subTotal={machine.service.cart.subTotal()}
          checkout={() => machine.dispatch('next')}
          close={() => machine.dispatch('close')}
        />
      );
    case 'delivery':
    case 'createOrder':
    case 'calculateFees':
      return (
        <Delivery
          throbbing={state !== 'delivery'}
          error={!!machine.service.cart.address?.unusable}
          stored={machine.service.cart.address}
          onSubmit={collectedAddress => {
            machine.service.cart.address = collectedAddress;
            machine.dispatch('next');
          }}
        />
      );
    case 'payment':
    case 'authorizingPayment':
    case 'createPrintJob':
    case 'verifyPrintJob':
    case 'updateOrderPrintJobStatus':
    case 'capturePayment':
      return (
        <StripeProvider apiKey="pk_test_DAZbsOWXXbvBe51IEVvVfc4H">
          <Elements>
            <Payment
              throbbing={state !== 'payment'}
              onBackToCart={() => machine.dispatch('backToCart')}
              paymentIntentClientSecret={machine.service.paymentIntentClientSecret}
              subTotal={machine.service.cart.subTotal()}
              shipping={machine.service.fees.shipping}
              taxes={machine.service.fees.taxes}
              ccFeeOffset={machine.service.fees.ccFeeOffset}
              onPay={getToken => machine.dispatch('next', getToken)}
            />
          </Elements>
        </StripeProvider>
      );
    case 'confirmation':
      return <Confirmation email={machine.service.cart.email || ''} onClose={() => {}} />;
    case 'brickSession':
      return (
        <UnrecoverableError
          onRetry={() => machine.dispatch('tryAgain')}
          onClose={() => machine.dispatch('close')}
        />
      );
    default:
      return <p>What? {state}</p>;
  }
};

export default CheckoutFlow;
