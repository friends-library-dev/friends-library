import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import { checkoutErrors as Err } from '@friends-library/types';
import Modal from '../src/checkout/Modal';
import CheckoutMachine from '../src/checkout/services/CheckoutMachine';
import CheckoutService from '../src/checkout/services/CheckoutService';
import MockCheckoutApi from '../src/checkout/services/MockCheckoutApi';
import CheckoutFlow from '../src/checkout/Flow';
import { cartPlusData, cart } from '../src/checkout/models/__tests__/fixtures';
import { coverSizes } from './decorators';

storiesOf('Checkout flow', module)
  .addDecorator(coverSizes)
  .add('happy path (prefill)', () => {
    const service = new CheckoutService(cartPlusData(), new MockCheckoutApi(1000));
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  })
  .add('happy path (empty)', () => {
    const service = new CheckoutService(cart(), new MockCheckoutApi(1000));
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  })
  .add('Error: shipping impossible', () => {
    const api = new MockCheckoutApi(1000);
    api.pushResponse('calculateFees', {
      ok: false,
      statusCode: 400,
      data: { msg: Err.SHIPPING_NOT_POSSIBLE },
    });
    const service = new CheckoutService(cartPlusData(), api);
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  })
  .add('Error: create order failed', () => {
    const api = new MockCheckoutApi(1000);
    api.pushResponse('createOrder', {
      ok: false,
      statusCode: 500,
      data: { msg: Err.ERROR_UPDATING_FLP_ORDER },
    });
    const service = new CheckoutService(cartPlusData(), api);
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  });
