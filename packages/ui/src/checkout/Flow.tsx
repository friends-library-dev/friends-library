import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutMachine from './services/CheckoutMachine';
import { LANG } from '../env';
import Cart from '../cart';
import Delivery from './Delivery';
import Payment from './Payment';
import Confirmation from './Confirmation';
import UnrecoverableError from './UnrecoverableError';
import CartItem, { CartItemData } from './models/CartItem';
import EmptyCart, { Props as EmptyCartProps } from './EmptyCart';

type Props = { machine: CheckoutMachine } & EmptyCartProps;

const CheckoutFlow: React.FC<Props> = ({ machine, recommendedBooks }) => {
  const cart = machine.service.cart;
  const [state, setState] = useState<string>(machine.getState());
  const [cartItems, setCartItems] = useState<CartItemData[]>(
    cart.items.map(i => i.toJSON()),
  );

  useEffect(() => {
    machine.on(`state:change`, setState);
    return () => {
      machine.removeListener(`state:change`, setState);
    };
  }, [machine]);

  switch (state) {
    case `cart`:
      if (cartItems.length === 0) {
        return <EmptyCart recommendedBooks={recommendedBooks} />;
      }
      return (
        <Cart
          items={cartItems}
          setItems={items => {
            cart.items = items.map(i => new CartItem(i));
            setCartItems(items);
          }}
          subTotal={cart.subTotal()}
          checkout={() => machine.dispatch(`next`)}
          onContinueBrowsing={() => machine.dispatch(`continueBrowsing`)}
        />
      );
    case `delivery`:
    case `createOrder`:
    case `calculateFees`:
      return (
        <Delivery
          throbbing={state !== `delivery`}
          onBack={() => machine.dispatch(`back`)}
          error={!!cart.address?.unusable}
          stored={{ ...cart.address, ...(cart.email ? { email: cart.email } : {}) }}
          onSubmit={data => {
            const { email, ...address } = data;
            cart.email = email;
            cart.address = address;
            machine.dispatch(`next`);
          }}
        />
      );
    case `payment`:
    case `authorizingPayment`:
    case `createPrintJob`:
    case `verifyPrintJob`:
    case `updateOrderPrintJobStatus`:
    case `capturePayment`:
      return (
        <StripeProvider
          apiKey={
            (process.env.GATSBY_NETLIFY_CONTEXT === `production`
              ? process.env.GATSBY_PROD_STRIPE_PUBLISHABLE_KEY
              : process.env.GATSBY_TEST_STRIPE_PUBLISHABLE_KEY) || ``
          }
        >
          <Elements locale={LANG}>
            <Payment
              throbbing={state !== `payment`}
              error={machine.service.popStripeError()}
              onBack={() => machine.dispatch(`back`)}
              paymentIntentClientSecret={machine.service.paymentIntentClientSecret}
              subTotal={cart.subTotal()}
              shipping={machine.service.fees.shipping}
              taxes={machine.service.fees.taxes}
              ccFeeOffset={machine.service.fees.ccFeeOffset}
              onPay={getToken => machine.dispatch(`next`, getToken)}
            />
          </Elements>
        </StripeProvider>
      );
    case `confirmation`:
      return (
        <Confirmation
          email={cart.email || ``}
          onClose={() => machine.dispatch(`finish`)}
        />
      );
    case `brickSession`:
      return (
        <UnrecoverableError
          onRetry={() => machine.dispatch(`tryAgain`)}
          onClose={() => machine.dispatch(`close`)}
        />
      );
    default:
      return null;
  }
};

export default CheckoutFlow;
