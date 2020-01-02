import React from 'react';
import Item from './Item';
import Button from '../Button';
import Back from '../checkout/Back';
import Progress from '../checkout/Progress';
import Header from '../checkout/Header';
import CartItem, { CartItemData } from '../checkout/models/CartItem';
import NoProfit from '../checkout/NoProfit';

interface Props {
  checkout: () => void;
  onContinueBrowsing: () => void;
  subTotal: number;
  items: CartItemData[];
  setItems: (items: CartItemData[]) => void;
}

const CartComponent: React.FC<Props> = ({
  checkout,
  onContinueBrowsing,
  items,
  setItems,
  subTotal,
}) => {
  return (
    <>
      <Header>Your Order</Header>
      <NoProfit />
      <Progress step="Order" />
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
          title={item.title[0]}
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
      <Back onClick={onContinueBrowsing}>Continue Browsing</Back>
      <Button className="bg-flmaroon mb-5 mx-auto" onClick={checkout}>
        Delivery &nbsp;&rsaquo;
      </Button>
    </>
  );
};

export default CartComponent;

export const SubLine: React.FC<{ label: string; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={`${className || ''} text-gray-700 text-sm flex`}>
    <span className="flex-grow">{label}</span>
    {children}
  </div>
);
