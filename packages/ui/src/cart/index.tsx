/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import Item from './Item';
import Button from '../Button';
import CartItem, { CartItemData } from '../checkout/models/CartItem';

interface Props {
  checkout: () => void;
  close: () => void;
  subTotal: number;
  items: CartItemData[];
  setItems: (items: CartItemData[]) => void;
}

const CartComponent: React.FC<Props> = ({
  checkout,
  close,
  items,
  setItems,
  subTotal,
}) => {
  return (
    <div>
      <h1>
        Your Cart <sup>({items.length})</sup>
      </h1>
      {items.map((item, index) => (
        <Item
          key={`item-${index}`}
          price={new CartItem(item).price()}
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
          <code>{(subTotal / 100).toFixed(2)}</code>
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

export const SubLine: React.FC<{ label: string; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div
    {...(className ? { className } : {})}
    css={css`
      color: #333;
      padding: 1px 0;
      display: flex;
      &.just-determined {
        background: palegoldenrod;
      }
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
