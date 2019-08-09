/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { CartItem } from '../checkout/types';
import Item from './Item';
import Button from '../Button';

interface Props {
  checkout: () => void;
  close: () => void;
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
}

const CartComponent: React.FC<Props> = ({ checkout, close, items, setItems }) => {
  return (
    <div>
      <h1>
        Your Cart <sup>({items.length})</sup>
      </h1>
      {items.map((item, index) => (
        <Item
          key={`item-${index}`}
          {...item}
          changeQty={(qty: number) => {
            items[index].quantity = qty;
            setItems([...items]);
          }}
          remove={() => {
            items.splice(index, 1);
            setItems([...items]);
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
            {items.reduce((st, item) => st + item.price * item.quantity, 0).toFixed(2)}
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
      <Button onClick={checkout}>Checkout &rarr;</Button>
      <Button secondary onClick={close}>
        Close
      </Button>
    </div>
  );
};

export default CartComponent;

export const SubLine: React.FC<{ label: string }> = ({ label, children }) => (
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
