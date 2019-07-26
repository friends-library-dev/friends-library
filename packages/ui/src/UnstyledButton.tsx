/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

interface Props {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const UnstyledButton: React.FC<Props> = ({ children, onClick, className }) => (
  <button
    {...(onClick ? { onClick } : {})}
    className={className || ''}
    css={css`
      background: none;
      border: 0;
      color: inherit;
      font-family: inherit;
      text-align: inherit;
      overflow: visible;
      padding: 0;
      cursor: pointer;

      &::-moz-focus-inner {
        border: 0;
        padding: 0;
      }
    `}
  >
    {children}
  </button>
);

export default UnstyledButton;
