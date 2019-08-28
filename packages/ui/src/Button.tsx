/** @jsx jsx  */
import React from 'react';
import cx from 'classnames';
import { jsx } from '@emotion/core';
import { styled } from '@friends-library/ui';
import UnstyledButton from './UnstyledButton';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  secondary?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledButton = styled(UnstyledButton)<{ secondary?: boolean; disabled?: boolean }>`
  opacity: ${p => (p.disabled ? '0.3' : 1)};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.15);
  width: 280px;
  height: 60px;
`;

const Button: React.FC<Props> = ({
  children,
  secondary,
  onClick,
  disabled,
  type,
  className,
}) => (
  <StyledButton
    className={cx(
      className,
      'block rounded-full font-sans text-center uppercase tracking-wider text-white focus:outline-none focus:shadow-outline',
    )}
    type={type || 'submit'}
    {...(onClick && !disabled ? { onClick } : {})}
    {...(secondary ? { secondary } : {})}
    disabled={disabled}
  >
    {children}
  </StyledButton>
);

export default Button;
