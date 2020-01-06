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
      <button
        className="absolute top-0 right-0 px-4 py-2 m-1 subtle-focus"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <span aria-hidden className="text-xl">
          &times;
        </span>
      </button>
      {children}
    </DialogContent>
  </DialogOverlay>
);

export default Modal;
