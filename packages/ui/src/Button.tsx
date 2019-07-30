/** @jsx jsx  */
import React from 'react';
import { jsx } from '@emotion/core';
import { styled } from '@friends-library/ui';
import UnstyledButton from './UnstyledButton';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  secondary?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledButton = styled(UnstyledButton)<{ secondary?: boolean; disabled?: boolean }>`
  opacity: ${p => (p.disabled ? '0.2' : 1)};
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  background: ${p => (p.secondary ? '#eee' : p.theme.primary.hex)};
  display: block;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  padding: 1em;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 200;
  letter-spacing: 1px;
  border-radius: 10px;
  color: ${p => (p.secondary ? p.theme.primary.hex : 'white')};
  margin: 12px 0;
`;

const Button: React.FC<Props> = ({ children, secondary, onClick, disabled, type }) => (
  <StyledButton
    type={type || 'submit'}
    {...(onClick && !disabled ? { onClick } : {})}
    {...(secondary ? { secondary } : {})}
    disabled={disabled}
  >
    {children}
  </StyledButton>
);

export default Button;
