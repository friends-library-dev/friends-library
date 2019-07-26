import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';
import CostExplanation from '../src/checkout/CostExplanation';
import CollectEmail from '../src/checkout/CollectEmail';
import Success from '../src/checkout/Success';

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
  ))
  .add('Success', () => (
    <Modal onClose={a('close modal')}>
      <Success onClose={a('close')} />
    </Modal>
  ))
  .add('Collect email', () => (
    <Modal onClose={a('close modal')}>
      <CollectEmail onSubmit={a('Submit')} />
    </Modal>
  ));
