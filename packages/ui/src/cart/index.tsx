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
    <div className="p-6 md:p-8">
      <h1 className="text-center tracking-widest text-2xl mb-5 uppercase">Your Order</h1>
      <p className="text-center font-serif text-md md:text-lg tracking-wide leading-relaxed text-gray-800 antialiased px-4 md:px-6 mb-8">
        We are committed to never making a profit from the books we make available on this
        website. For that reason, when you order one or more paperback books, we charge
        you <i>only and exactly</i> what we calculate it will cost us to have the books
        printed and shipped from our printing partner.
      </p>
      <div className="BreadCrumbs md:p-5 bg-gray-100 border-t-8 border-flmaroon">
        <ul className="hidden md:flex text-gray-900 justify-center tracking-wider">
          <li className="mx-8 text-flmaroon">[ 01. Order ]</li>
          <li className="mx-8">02. Review</li>
          <li className="mx-8">03. Payment</li>
        </ul>
      </div>
      <div className="ColumnHeadings flex text-gray-900 text-center font-semibold antialiased mt-6 border-b border-gray-300 pb-2">
        <div className="w-2/3 md:w-3/5 text-left">Item</div>
        <div className="w-1/3 md:w-2/5 flex">
          <div className="w-1/2 md:w-1/3 order-2 md:order-1">Price</div>
          <div className="w-1/2 md:w-1/3 order-1">
            <span className="md:hidden">Qty.</span>
            <span className="hidden md:inline">Quantity</span>
          </div>
          <div className="hidden md:block md:w-1/3 order-2">Remove</div>
        </div>
      </div>
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
      <div className="text-right font-sans text-lg mb-5 py-4 border-b ">
        <span className="font-bold tracking-wider">Total:</span>
        <span className="pl-4 font-sans text-gray-700 text-md md:text-lg antialiased md:tracking-wider">
          ${(subTotal / 100).toFixed(2)}
        </span>
      </div>
      <div
        className="mb-8 font-sans antialiased text-gray-600 tracking-wide"
        onClick={close}
      >
        &larr; Continue Browsing
      </div>
      <Button className="bg-flmaroon mb-5 mx-auto" onClick={checkout}>
        Review
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
    className={`${className || ''} text-gray-700 text-sm`}
    css={css`
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
