import React, { useState } from 'react';
import cx from 'classnames';

interface Props {
  quantity: number;
  changeQuantity: (qty: number) => void;
}

const Component: React.FC<Props> = ({ quantity, changeQuantity }) => {
  const [strQty, setStrQty] = useState<string>(String(quantity));
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
              setStrQty(String(quantity - 1));
              changeQuantity(quantity - 1);
            }
          }}
        >
          &lt;
        </span>
        <input
          className={cx(
            'bg-gray-100 w-8 md:w-10 py-2 text-center font-sans text-md md:text-lg subtle-focus',
            strQty.trim() === '0' ? 'text-red-700' : 'text-gray-700',
          )}
          type="input"
          value={strQty}
          onChange={evt => {
            let val = evt.target.value.trim();
            if (val !== '' && !val.match(/^\d+$/)) {
              val = '1';
            }
            setStrQty(val);
            if (val === '') return;
            let numQty = Number(val);
            if (Number.isNaN(numQty)) {
              numQty = 1;
            }
            changeQuantity(numQty);
          }}
        />
        <span
          className="hidden md:inline pl-2 select-none"
          onClick={() => {
            setStrQty(String(quantity + 1));
            changeQuantity(quantity + 1);
          }}
        >
          &gt;
        </span>
      </div>
    </div>
  );
};

export default Component;
