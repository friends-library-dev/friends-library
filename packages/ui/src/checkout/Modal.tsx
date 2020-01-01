import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import './Modal.css';

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children }) => (
  <DialogOverlay className="CheckoutModal bg-white md:bg-transparent md:flex items-center justify-center inset-0 fixed overflow-auto">
    <DialogContent
      className="CheckoutModal__Content w-full max-w-6xl p-10 md:p-12 outline-none bg-white md:shadow-direct"
      aria-label="Cart"
    >
      {children}
    </DialogContent>
  </DialogOverlay>
);

export default Modal;
