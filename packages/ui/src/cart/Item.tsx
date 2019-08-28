import React from 'react';
import { withTheme } from 'emotion-theming';
import ItemQuantity from './ItemQuantity';
import './Item.css';

interface Props {
  title: string;
  author: string;
  quantity: number;
  price: number;
  coverUrl: string;
  changeQty: (qtn: number) => void;
  remove: () => void;
}

const Component: React.FC<Props> = ({
  title,
  author,
  price,
  quantity,
  coverUrl,
  changeQty,
  remove,
}) => {
  return (
    <div className="Cart__Item flex py-2 md:py-6 border-b border-gray-300">
      <div className="w-2/3 md:w-3/5 flex">
        <div className="w-1/4 mr-1 cover-img flex flex-col justify-center">
          <img src={coverUrl} alt="" />
        </div>
        <dl className="w-3/4 border-r border-gray-300 p-2 md:px-6 flex-grow">
          <dt className="max-w-sm font-sans font-bold text-md md:text-lg tracking-wide md:tracking-widest pb-2 pt-2">
            {title}
          </dt>
          <dd className="font-serif font-thin text-gray-700 antialiased text-md md:text-lg md:tracking-wide">
            {author}
          </dd>
        </dl>
      </div>
      <div className="w-1/3 md:w-2/5 flex text-center">
        <ItemQuantity quantity={quantity} changeQuantity={changeQty} />
        <div className="w-1/2 md:w-1/3 flex flex-col justify-center price">
          <code className="px-1 font-sans text-gray-700 text-md md:text-lg antialiased md:tracking-wider">
            ${(price / 100).toFixed(2)}
          </code>
        </div>
        <div
          className="hidden md:flex md:w-1/3 remove flex-col order-2 justify-center"
          onClick={remove}
        >
          <span>&#x2715;</span>
        </div>
      </div>
    </div>
  );
};

export default withTheme(Component);
