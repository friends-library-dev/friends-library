import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import CartModel from '../src/checkout/models/Cart';
import Cart from '../src/cart';
import { cartItemsData } from '../src/checkout/models/__tests__/fixtures';
import CartItem, { CartItemData } from '../src/checkout/models/CartItem';

const StatefulCart: React.FC = () => {
  const cart = CartModel.fromJson({ items: cartItemsData() });
  const [items, setItems] = useState<CartItemData[]>(cart.items.map(i => i.toJSON()));
  return (
    <Modal onClose={a('close modal')}>
      <Cart
        subTotal={cart.subTotal()}
        items={items}
        setItems={items => {
          cart.items = items.map(i => new CartItem(i));
          setItems(items);
        }}
        checkout={a('checkout')}
        close={a('close')}
      />
    </Modal>
  );
};

storiesOf('Cart', module).add('Cart', () => <StatefulCart />);
