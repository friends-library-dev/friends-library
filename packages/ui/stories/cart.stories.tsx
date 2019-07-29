import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import Cart from '../src/cart';

storiesOf('Cart', module).add('Cart', () => (
  <Modal onClose={a('close modal')}>
    <Cart />
  </Modal>
));
