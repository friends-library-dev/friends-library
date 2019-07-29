/** @jsx jsx */
import React, { useState } from 'react';
import { styled } from '@friends-library/ui';
import { jsx, css } from '@emotion/core';
import Item from './Item';
import Button from '../Button';

const Cart = styled.div``;

export const items = [
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

export type CartItem = typeof items[0];

const CartComponent: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  return (
    <Cart>
      <h1>
        Your Cart <sup>({cartItems.length})</sup>
      </h1>
      {cartItems.map((item, index) => (
        <Item
          key={`item-${index}`}
          {...item}
          changeQty={(qty: number) => {
            cartItems[index].quantity = qty;
            setCartItems([...cartItems]);
          }}
          remove={() => {
            cartItems.splice(index, 1);
            setCartItems([...cartItems]);
          }}
        />
      ))}
      <div
        css={css`
          margin: 5px 0 25px;
        `}
      >
        <SubLine label="Subtotal:">
          <code>
            {cartItems.reduce((st, item) => st + item.price * item.quantity, 0)}
          </code>
        </SubLine>
        <SubLine label="Shipping:">
          <code>
            <i>~TBD~</i>
          </code>
        </SubLine>
        <SubLine label="Courtesy code:">
          <input style={{ width: 70 }} type="text" />
        </SubLine>
      </div>
      <Button>Checkout &rarr;</Button>
      <Button secondary>Close</Button>
    </Cart>
  );
};

export default CartComponent;

const SubLine: React.FC<{ label: string }> = ({ label, children }) => (
  <div
    css={css`
      color: #333;
      padding: 1px 0;
      display: flex;
    `}
  >
    <span
      css={css`
        flex-grow: 1;
      `}
    >
      {label}
    </span>
    {children}
  </div>
);
