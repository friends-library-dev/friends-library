/** @jsx jsx */
import React, { useEffect, useState, useRef } from 'react';
import { jsx, css } from '@emotion/core';
import Input from './Input';
import Button from '../Button';

interface Props {
  onPay: (getToken: () => Promise<string>) => void;
}

const CollectCreditCard: React.FC<Props> = ({ onPay }) => {
  const [ccNum, setCcNum] = useState<string>('');
  const [expiration, setExpiration] = useState<string>('');
  const [ccv, setCcv] = useState<string>('');
  const ccInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ccInput && ccInput.current) {
      ccInput.current.focus();
    }
  }, []);
  const validCc = /\d{16}/;
  const validCcv = /\d{3,4}/;
  const isFilledOut = !!(validCc.test(ccNum) && expiration && validCcv.test(ccv));
  return (
    <div
      css={css`
        label {
          display: inline-block;
          color: #777;
          padding: 4px 0;
          font-size: 13px;
          text-transform: uppercase;
        }
      `}
    >
      <h1 style={{ marginTop: 0 }}>Enter Card Details</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!isFilledOut) {
            return;
          }
          onPay(() => Promise.resolve('tok_visa'));
        }}
      >
        <label>Card number:</label>
        <Input
          ref={ccInput}
          type="tel"
          autoComplete="cc-number"
          onChange={e => setCcNum(e.target.value)}
          value={ccNum}
          placeholder="Card Number"
        />
        <label>Valid thru:</label>
        <Input
          type="tel"
          autoComplete="cc-exp"
          onChange={e => setExpiration(e.target.value)}
          value={expiration}
          placeholder="MM-YYYY"
        />
        <label>CCV:</label>
        <Input
          type="tel"
          autoComplete="cc-csc"
          onChange={e => setCcv(e.target.value)}
          value={ccv}
          placeholder="123"
        />
        <Button disabled={!isFilledOut}>Pay with card</Button>
      </form>
    </div>
  );
};

export default CollectCreditCard;
