/** @jsx jsx  */
import React from 'react';
import { jsx } from '@emotion/core';
import { styled } from '@friends-library/ui';
import UnstyledButton from './UnstyledButton';

interface Props {
  secondary?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledButton = styled(UnstyledButton)<{ secondary?: boolean }>`
  background: ${p => (p.secondary ? p.theme.blue.rgba(0.5) : p.theme.primary.hex)};
  display: block;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  padding: 1em;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 200;
  letter-spacing: 1px;
  border-radius: 50px;
  color: ${p => (p.secondary ? p.theme.primary.hex : 'white')};
  margin: 15px 0;
`;

const Button: React.FC<Props> = ({ children, secondary, onClick }) => (
  <StyledButton {...(onClick ? { onClick } : {})} {...(secondary ? { secondary } : {})}>
    {children}
  </StyledButton>
);

export default Button;
