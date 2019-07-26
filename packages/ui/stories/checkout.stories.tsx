import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';

storiesOf('Checkout', module).add('MessageThrobber', () => (
  <Modal onClose={a('close modal')}>
    <MessageThrobber msg="Calculating exact shipping cost" />
  </Modal>
));
