import React from 'react';

const ErrorMsg: React.FC = ({ children }) => {
  return <p className="bg-red-700 font-sans text-white p-4 mt-8">{children}</p>;
};

export default ErrorMsg;
