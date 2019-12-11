import React from 'react';
import cx from 'classnames';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const UnstyledButton: React.FC<Props> = ({ children, onClick, className, type }) => (
  <button
    type={type || 'submit'}
    {...(onClick ? { onClick } : {})}
    className={cx(className, 'border-none', 'overflow-visible', 'cursor-pointer')}
  >
    {children}
  </button>
);

export default UnstyledButton;
