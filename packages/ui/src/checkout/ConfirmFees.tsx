import React from 'react';
import Button from '../Button';
import { SubLine } from '../cart/index';

interface Props {
  onConfirm: () => void;
  onBackToCart: () => void;
  subTotal: number;
  shipping: number;
  taxes: number;
  ccFeeOffset: number;
}

const ConfirmFees: React.FC<Props> = ({
  onConfirm,
  onBackToCart,
  shipping,
  subTotal,
  taxes,
  ccFeeOffset,
}) => (
  <div>
    <h1 className="text-2xl mb-5 uppercase">
      Grand Total:{' '}
      <code>${((subTotal + shipping + taxes + ccFeeOffset) / 100).toFixed(2)}</code>
    </h1>
    <p style={{ marginBottom: 25 }}>
      We've determined exact shipping cost for your address from our print-on-demand
      partner, plus {taxes > 0 ? 'taxes and' : ''} fees.
    </p>
    <SubLine label="Subtotal:">
      <code>${(subTotal / 100).toFixed(2)}</code>
    </SubLine>
    <SubLine label="Shipping:" className="just-determined">
      <code>&rarr; ${(shipping / 100).toFixed(2)}</code>
    </SubLine>
    <SubLine label="Credit card fee offset:" className="just-determined">
      <code>&rarr; ${(ccFeeOffset / 100).toFixed(2)}</code>
    </SubLine>
    {taxes > 0 && (
      <SubLine label="Taxes:" className="just-determined">
        <code>&rarr; ${(taxes / 100).toFixed(2)}</code>
      </SubLine>
    )}
    <SubLine label="Grand Total:">
      <code>
        <b>${((subTotal + shipping + taxes + ccFeeOffset) / 100).toFixed(2)}</b>
      </code>
    </SubLine>

    <Button className="bg-flblue mt-6 mb-3" onClick={onConfirm}>
      Continue &rarr;
    </Button>
    <Button className="bg-gray-300 text-gray-900" secondary onClick={onBackToCart}>
      &larr; Back to Cart
    </Button>
  </div>
);

export default ConfirmFees;
