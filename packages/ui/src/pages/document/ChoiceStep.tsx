import React from 'react';

interface Props {
  title: string;
}

const ChoiceStep: React.FC<Props> = ({ title, children }) => (
  <div className="text-white py-6 font-sans antialiased">
    <header className="text-center pb-6">{title}</header>
    {children}
  </div>
);

export default ChoiceStep;
