import React from 'react';
import Button from '../Button';
import Header from './Header';
import Progress from './Progress';

const Success: React.FC<{ onClose: () => void; email: string }> = ({
  onClose,
  email,
}) => (
  <div>
    <Header>Confirmed!</Header>
    <Progress step="Confirmation" />
    <p className="body-text text-center mt-10">
      We've processed your order. You will receive an email to <code>{email}</code> with a
      confirmation shortly, and in a few days we'll also send you a tracking number for
      your package once it ships. We really hope you enjoy and benefit from the book you
      ordered!
    </p>
    <Button className="bg-flprimary mx-auto mt-10" onClick={onClose}>
      Close
    </Button>
  </div>
);

export default Success;
