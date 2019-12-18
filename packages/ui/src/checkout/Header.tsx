import React from 'react';

const Header: React.FC = ({ children }) => (
  <h1 className="text-center tracking-widest text-2xl mb-5 uppercase">{children}</h1>
);

export default Header;
