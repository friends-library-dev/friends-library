import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import CheckoutMachine from '../src/checkout/CheckoutMachine';
import CheckoutFlow from '../src/checkout/Flow';
import { CartItem } from '../src/checkout/types';
const items: CartItem[] = [
  {
    title: 'Journal of George Fox',
    author: 'George Fox',
    edition: 'original',
    quantity: 1,
    price: 8.25,
  },
  {
    title: 'Walk in the Spirit',
    author: 'Hugh Turford',
    edition: 'updated',
    quantity: 3,
    price: 2.64,
  },
];

storiesOf('Checkout flow', module).add('happy path', () => (
  <Modal onClose={a('close modal')}>
    <CheckoutFlow cart={items} machine={new CheckoutMachine()} />
  </Modal>
));
