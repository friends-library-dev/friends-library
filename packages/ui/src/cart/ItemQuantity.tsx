import React from 'react';
import cx from 'classnames';

interface Props {
  quantity: number;
  changeQuantity: (qty: number) => void;
}

const Component: React.FC<Props> = ({ quantity, changeQuantity }) => {
  return (
    <div className="w-1/2 md:w-1/3 flex flex-col justify-center md:order-1">
      <div>
        <span
          className={cx('hidden md:inline pr-2 select-none', {
            'cursor-pointer': quantity > 1,
            'cursor-not-allowed opacity-25': quantity < 2,
          })}
          onClick={() => {
            if (quantity > 1) {
              changeQuantity(quantity - 1);
            }
          }}
        >
          &lt;
        </span>
        <input
          className="bg-gray-100 w-8 md:w-10 py-2 text-center font-sans text-gray-700 text-md md:text-lg"
          type="number"
          value={quantity}
          onChange={evt => {
            const newQty = Number(evt.target.value);
            newQty > 0 && changeQuantity(newQty);
          }}
        />
        <span
          className="hidden md:inline pl-2 select-none"
          onClick={() => changeQuantity(quantity + 1)}
        >
          &gt;
        </span>
      </div>
    </div>
  );
};

export default Component;
