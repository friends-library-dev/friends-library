import React from 'react';
import './CartBadge.css';

const CartBadge: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      className="CartBadge rounded-full border-flprimary border-solid border ml-2 flex flex-row items-center justify-center relative cursor-pointer"
      onClick={onClick}
    >
      <Icon />
    </div>
  );
};

export default CartBadge;

const Icon: React.FC = () => {
  return (
    <svg
      height="22px"
      width="22px"
      className="text-flprimary fill-current"
      viewBox="0 0 100 100"
    >
      <path d="M81,91H19a3,3,0,0,1-3-3.21l4-56A3,3,0,0,1,23,29H77a3,3,0,0,1,3,2.79l4,56A3,3,0,0,1,81,91ZM22.22,85H77.78L74.21,35H25.79Z"></path>
      <path d="M64,26a3,3,0,0,1-3-3,11,11,0,0,0-22,0,3,3,0,0,1-6,0,17,17,0,0,1,34,0A3,3,0,0,1,64,26Z"></path>
      <path d="M36,50a3,3,0,0,1-3-3V23a3,3,0,0,1,6,0V47A3,3,0,0,1,36,50Z"></path>
      <path d="M64,50a3,3,0,0,1-3-3V23a3,3,0,0,1,6,0V47A3,3,0,0,1,64,50Z"></path>
    </svg>
  );
};
