/** @jsx jsx  */
import React from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { jsx } from '@emotion/core';
import { styled } from '@friends-library/ui';
import UnstyledButton from './UnstyledButton';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  secondary?: boolean;
  disabled?: boolean;
  className?: string;
  shadow?: boolean;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface StyledProps {
  secondary?: boolean;
  disabled?: boolean;
  shadow?: boolean;
}

const StyledButton = styled(UnstyledButton)<StyledProps>`
  opacity: ${p => (p.disabled ? '0.3' : 1)};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: ${p => (p.shadow ? '0 0 10px 4px rgba(0, 0, 0, 0.15)' : 'none')};
  width: 280px;
  height: 60px;
`;

const StyledLink = styled(Link)<StyledProps>`
  opacity: ${p => (p.disabled ? '0.3' : 1)};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: ${p => (p.shadow ? '0 0 10px 4px rgba(0, 0, 0, 0.15)' : 'none')};
  width: 280px;
  height: 60px;
  line-height: 60px;
`;

const Button: React.FC<Props> = ({
  children,
  secondary,
  onClick,
  disabled,
  type,
  className,
  to,
  shadow = true,
}) => {
  const Element = typeof to === 'string' ? StyledLink : StyledButton;
  return (
    // @ts-ignore
    <Element
      to={to || ''}
      className={cx(className, 'btn')}
      {...(!to ? { type: type || 'submit' } : {})}
      {...(onClick && !disabled ? { onClick } : {})}
      {...(secondary ? { secondary } : {})}
      disabled={disabled}
      shadow={shadow}
    >
      {children}
    </Element>
  );
};

export default Button;
