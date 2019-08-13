import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';

const validEmail = /\S+@\S+\.\S+/;

const CostExplanation: React.FC<{
  onSubmit: (email: string) => void;
  stored: string;
}> = ({ onSubmit, stored }) => {
  const [email, setEmail] = useState<string>(stored);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input && input.current) {
      input.current.focus();
    }
  });
  return (
    <div>
      <h1 className="text-2xl mb-5 uppercase">Enter Your Email</h1>
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
          className="input mt-3 mb-6"
          ref={input}
          type="email"
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          placeholder="you@email.com"
        />
        <Button className="bg-flblue" disabled={!validEmail.test(email)}>
          Next &rarr;
        </Button>
      </form>
    </div>
  );
};

export default CostExplanation;
