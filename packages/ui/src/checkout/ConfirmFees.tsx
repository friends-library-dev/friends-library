import React from 'react';
import Button from '../Button';
import { SubLine } from '../cart/index';

interface Props {
  onConfirm: () => void;
  onBackToCart: () => void;
  subTotal: number;
  shipping: number;
}

const ConfirmFees: React.FC<Props> = ({
  onConfirm,
  onBackToCart,
  shipping,
  subTotal,
}) => (
  <div>
    <h1 style={{ marginTop: 0 }}>
      Shipping cost: <code>${(shipping / 100).toFixed(2)}</code>
    </h1>
    <p style={{ marginBottom: 25 }}>
      We've received exact shipping cost for your address from our print-on-demand
      partner: <code>${(shipping / 100).toFixed(2)}</code>.
    </p>
    <SubLine label="Subtotal:">
      <code>${(subTotal / 100).toFixed(2)}</code>
    </SubLine>
    <SubLine label="Shipping:">
      <code>${(shipping / 100).toFixed(2)}</code>
    </SubLine>
    <SubLine label="Grand Total:">
      <code>
        <b>${((subTotal + shipping) / 100).toFixed(2)}</b>
      </code>
    </SubLine>

    <Button onClick={onConfirm}>Continue &rarr;</Button>
    <Button secondary onClick={onBackToCart}>
      &larr; Back to Cart
    </Button>
  </div>
);

export default ConfirmFees;
