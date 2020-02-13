import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import './Button.css';

interface Props {
  className?: string;
  to?: string;
  onClick?: () => any;
  disabled?: boolean;
  shadow?: boolean;
  textColor?: string;
  bg?: 'gold' | 'blue' | 'green' | 'maroon' | 'primary' | null;
}

const Button: React.FC<Props> = ({
  className,
  to,
  onClick,
  disabled,
  children,
  shadow,
  bg,
  textColor = 'white',
}) => {
  const props = {
    className: cx('Btn', className, `text-${textColor}`, {
      [`bg-fl${bg || 'primary'}`]: bg !== null,
      [`hover:bg-fl${bg || 'primary'}-800`]: bg !== null,
      'shadow-btn': shadow,
      'opacity-25': disabled,
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled,
    }),
    ...(onClick && !disabled ? { onClick } : {}),
  };

  if (typeof to === 'string') {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button {...props} {...(disabled ? { disabled } : {})}>
      {children}
    </button>
  );
};

export default Button;
