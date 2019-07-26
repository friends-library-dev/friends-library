/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { Theme } from 'theme';

/* height, width, radius, margin */
const Component: React.FC<{ msg: string; theme: Theme }> = ({ msg, theme }) => (
  <div
    css={css`
      max-width: 75vw;
    `}
  >
    <svg
      viewBox="0 0 32 10"
      css={css`
        fill: ${theme.primary.hex};
        display: block;
        width: 175px;
        margin: 0 auto;
      `}
    >
      <circle cx="10" cy="4" r="1">
        <Animate begin="0" />
      </circle>
      <circle cx="16" cy="4" r="1">
        <Animate begin="0.3" />
      </circle>
      <circle cx="22" cy="4" r="1">
        <Animate begin="0.6" />
      </circle>
    </svg>
    <p
      css={css`
        font-family: Baskerville, serif;
        font-size: 1.75rem;
        line-height: 1.4em;
        text-align: center;
        color: ${theme.gray.hex};
        margin: 5px;
      `}
    >
      {msg}
    </p>
  </div>
);

export default withTheme(Component);

const Animate: React.FC<{ begin: string }> = ({ begin }) => (
  <animate
    attributeName="r"
    values="1; 3; 1; 1"
    dur="1.2s"
    repeatCount="indefinite"
    begin={begin}
    keyTimes="0;0.2;0.7;1"
    keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
    calcMode="spline"
  />
);
