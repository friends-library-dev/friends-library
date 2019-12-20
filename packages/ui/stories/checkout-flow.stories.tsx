import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
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
    const service = new CheckoutService(cartPlusData(), new MockCheckoutApi(3500));
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  })
  .add('happy path (empty)', () => {
    const service = new CheckoutService(cart(), new MockCheckoutApi(3500));
    const machine = new CheckoutMachine(service);
    return (
      <Modal onClose={a('close modal')}>
        <CheckoutFlow machine={machine} />
      </Modal>
    );
  });
