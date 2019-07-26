import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';
import CostExplanation from '../src/checkout/CostExplanation';

storiesOf('Checkout', module)
  .add('MessageThrobber', () => (
    <Modal onClose={a('close modal')}>
      <MessageThrobber msg="Calculating exact shipping cost" />
    </Modal>
  ))
  .add('CostExplanation', () => (
    <Modal onClose={a('close modal')}>
      <CostExplanation onGotIt={a('Got it!')} />
    </Modal>
  ));
