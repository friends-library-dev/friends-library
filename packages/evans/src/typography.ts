import { css } from '@emotion/core';

const h = css`
  color: #222;
  line-height: 1.2em;
  font-weight: 300;
`;

export const h1 = css`
  compose: ${h};
  font-size: 38px;
`;

export const h2 = css`
  compose: ${h};
  font-size: 22.5px;
`;

export const h3 = css`
  compose: ${h};
  font-size: 18px;
`;
