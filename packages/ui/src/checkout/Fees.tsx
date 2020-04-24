import React from 'react';
import { t } from '@friends-library/locale';
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
          <td>{t`Subtotal`}</td>
          <td>{money(subTotal)}</td>
        </tr>
        <tr>
          <td>{t`Shipping`}</td>
          <td>{money(shipping)}</td>
        </tr>
        <tr>
          <td>{t`Credit Card Fee Offset`}</td>
          <td>{money(ccFeeOffset)}</td>
        </tr>
        <tr>
          <td>{t`Taxes`}</td>
          <td>{money(taxes)}</td>
        </tr>
        <tr className="text-black font-bold">
          <td>{t`Grand Total`}</td>
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
