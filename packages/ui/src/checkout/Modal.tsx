import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import './Modal.css';

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, onClose }) => (
  <DialogOverlay
    onDismiss={onClose}
    className="CheckoutModal bg-white md:bg-transparent md:flex items-center justify-center inset-0 fixed overflow-auto"
  >
    <DialogContent
      className="CheckoutModal__Content relative w-full max-w-6xl p-10 md:p-16 outline-none bg-white md:shadow-direct"
      aria-label="Cart"
    >
      {children}
      <button className="absolute top-0 right-0 p-4 mt-1 mr-2" onClick={onClose}>
        <span className="sr-only">Close</span>
        <span aria-hidden className="text-xl">
          &times;
        </span>
      </button>
    </DialogContent>
  </DialogOverlay>
);

export default Modal;
