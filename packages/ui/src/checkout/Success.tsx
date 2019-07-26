import React from 'react';
import Link from 'gatsby-link';
import Button from '../Button';

const Success: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div>
    <h1 style={{ marginTop: 0 }}>Success!</h1>
    <p style={{ marginBottom: 25 }}>
      We've processed your order. You will receive an email to{' '}
      <code>you@example.com</code> with a confirmation shortly, and in a few days we'll
      also send you a tracking number for your package once it ships. We really hope you
      enjoy and benefit from the book you ordered!
    </p>
    <Button onClick={onClose}>Close</Button>
  </div>
);

export default Success;
