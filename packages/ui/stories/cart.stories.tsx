import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import Cart from '../src/cart';
import { CartItem } from '../src/checkout/types';

const cart: CartItem[] = [
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

const StatefulCart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>(cart);
  return (
    <Modal onClose={a('close modal')}>
      <Cart
        items={items}
        setItems={setItems}
        checkout={a('checkout')}
        close={a('close')}
      />
    </Modal>
  );
};

storiesOf('Cart', module).add('Cart', () => <StatefulCart />);
