import React from 'react';
import './Heading.css';

const Heading: React.FC<{ className?: string }> = ({ children, className }) => (
  <h1
    className={`${className ||
      ''} Heading font-sans uppercase text-center text-2xl mb-5 text-3xl tracking-wider font-bold`}
  >
    {children}
  </h1>
);

export default Heading;
