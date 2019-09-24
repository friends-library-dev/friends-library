import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import CartModel from '../src/checkout/models/Cart';
import Cart from '../src/cart';
import CartItem from '../src/cart/Item';
import { cartItemsData, cartItemData3 } from '../src/checkout/models/__tests__/fixtures';
import CartItemModel, { CartItemData } from '../src/checkout/models/CartItem';

const StatefulCart: React.FC = () => {
  const cart = CartModel.fromJson({ items: [...cartItemsData(), cartItemData3()] });
  const [items, setItems] = useState<CartItemData[]>(cart.items.map(i => i.toJSON()));
  return (
    <Cart
      subTotal={cart.subTotal()}
      items={items}
      setItems={items => {
        cart.items = items.map(i => new CartItemModel(i));
        setItems(items);
      }}
      checkout={a('checkout')}
      close={a('close')}
    />
  );
};

const StatefulCartItem: React.FC = () => {
  const [qty, setQty] = useState<number>(1);
  const data = cartItemData3();
  return (
    <CartItem
      title={data.title}
      author={data.author}
      quantity={qty}
      coverUrl={data.coverPngUrl}
      price={422}
      changeQty={setQty}
      remove={a('remove')}
    />
  );
};

storiesOf('Cart', module)
  .add('Cart', () => <StatefulCart />)
  .add('CartItem', () => <StatefulCartItem />);