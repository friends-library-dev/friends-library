import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';

const validEmail = /\S+@\S+\.\S+/;

const CostExplanation: React.FC<{ onSubmit: (emailAddress: string) => void }> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState<string>('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input && input.current) {
      input.current.focus();
    }
  });
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Enter Your Email</h1>
      <p>
        Your email address is how we will contact you with your shipment tracking number
        or in case of any problem.
      </p>
      <form
        onSubmit={e => {
          e.preventDefault();
          validEmail.test(email) && onSubmit(email);
        }}
      >
        <input
          ref={input}
          style={{
            fontSize: '25px',
            width: '100%',
            padding: '5px',
            marginBottom: '10px',
          }}
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          placeholder="you@email.com"
        />
        <Button disabled={!validEmail.test(email)}>Next &rarr;</Button>
      </form>
    </div>
  );
};

export default CostExplanation;
