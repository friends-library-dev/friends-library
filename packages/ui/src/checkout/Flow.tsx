import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutMachine from './services/CheckoutMachine';
import Cart from '../cart';
import Delivery from './Delivery';
import Payment from './Payment';
import MessageThrobber from './MessageThrobber';
import Success from './Success';
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
      return (
        <Delivery
          stored={machine.service.cart.address}
          onSubmit={collectedAddress => {
            machine.service.cart.address = collectedAddress;
            machine.dispatch('next');
          }}
        />
      );
    case 'payment':
      return (
        <StripeProvider apiKey="pk_test_DAZbsOWXXbvBe51IEVvVfc4H">
          <Elements>
            <Payment
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
    case 'calculateFees':
      return <MessageThrobber msg="Calculating exact shipping cost and fees..." />;
    case 'createOrder':
      return <MessageThrobber msg="Creating order..." />;
    case 'authorizingPayment':
      return <MessageThrobber msg="Pre-authorizing credit card payment..." />;
    case 'createPrintJob':
      return <MessageThrobber msg="Payment authed. Submitting order to printer..." />;
    case 'verifyPrintJob':
      return <MessageThrobber msg="Verifying print job..." />;
    case 'updateOrderPrintJobStatus':
      return <MessageThrobber msg="Updating order print job status" />;
    case 'capturePayment':
      return <MessageThrobber msg="Order validated. Charging your credit card..." />;
    case 'confirmation':
      return <Success email={machine.service.cart.email || ''} onClose={() => {}} />;
    default:
      return <p>What? {state}</p>;
  }
};

export default CheckoutFlow;
