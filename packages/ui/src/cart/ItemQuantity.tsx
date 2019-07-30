/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

interface Props {
  quantity: number;
  changeQuantity: (qty: number) => void;
}

const Component: React.FC<Props> = ({ quantity, changeQuantity }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <input
        css={css`
          font-size: 13px;
          width: 35px;
          text-align: center;
        `}
        type="number"
        value={quantity}
        onChange={evt => {
          const newQty = Number(evt.target.value);
          if (newQty > 0) {
            changeQuantity(newQty);
          }
        }}
      />
    </div>
  );
};

export default Component;
