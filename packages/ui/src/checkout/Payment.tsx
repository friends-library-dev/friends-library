import React from 'react';
import Header from './Header';
import Progress from './Progress';
import './Payment.css';

interface Props {
  onConfirm: () => void;
  onBackToCart: () => void;
  subTotal: number;
  shipping: number;
  taxes: number;
  ccFeeOffset: number;
  onPay: (getToken: () => Promise<string>) => void;
}

const Payment: React.FC<Props> = ({ shipping, taxes, subTotal, ccFeeOffset }) => (
  <div>
    <Header>Payment</Header>
    <Progress step="Payment" />
    <table className="Fees w-full my-4">
      <tr>
        <td>Subtotal</td>
        <td>{money(subTotal)}</td>
      </tr>
      <tr>
        <td>Shipping</td>
        <td>{money(shipping)}</td>
      </tr>
      <tr>
        <td>Credit Card Fee Offset</td>
        <td>{money(ccFeeOffset)}</td>
      </tr>
      <tr>
        <td>Taxes</td>
        <td>{money(taxes)}</td>
      </tr>
      <tr className="text-black font-bold">
        <td>Grand Total</td>
        <td>{money(subTotal + shipping + taxes + ccFeeOffset)}</td>
      </tr>
    </table>
  </div>
);

export default Payment;

function money(amt: number): string {
  return `$${(amt / 100).toFixed(2)}`;
}
