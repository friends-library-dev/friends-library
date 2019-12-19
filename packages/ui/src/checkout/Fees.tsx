import React from 'react';
import './Fees.css';

interface Props {
  subTotal: number;
  shipping: number;
  taxes: number;
  ccFeeOffset: number;
  className: string;
}

const Fees: React.FC<Props> = ({ className, subTotal, shipping, taxes, ccFeeOffset }) => {
  return (
    <table className={`${className} Fees border-separate border-gray-400`}>
      <tbody>
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
      </tbody>
    </table>
  );
};

export default Fees;

function money(amt: number): string {
  return `$${(amt / 100).toFixed(2)}`;
}
