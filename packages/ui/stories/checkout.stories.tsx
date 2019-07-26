import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';

storiesOf('Checkout modal', module).add('default', () => (
  <Modal onClose={a('close modal')}>
    <div style={{ color: 'white' }}>My rad modal content! 👍</div>
  </Modal>
));
