import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Block: React.FC<Props> = ({ children, className }) => (
  <section className={className}>{children}</section>
);

export default Block;
