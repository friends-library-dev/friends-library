import React from 'react';
import './Hamburger.css';

interface Props {
  onClick: () => any;
}

const Component: React.FC<Props> = ({ onClick }) => (
  <div className="Hamburger flex flex-col justify-center bg-flprimary" onClick={onClick}>
    <div />
    <div />
    <div />
  </div>
);

export default Component;
