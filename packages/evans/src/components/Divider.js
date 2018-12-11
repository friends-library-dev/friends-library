// @flow
import * as React from 'react';
import { css } from '@emotion/core';

const element = css`
  position: relative;
  height: 20px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Ccircle%20fill%3D%22none%22%20stroke%3D%22%23e5e5e5%22%20stroke-width%3D%222%22%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%227%22%3E%3C%2Fcircle%3E%0A%3C%2Fsvg%3E%0A");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  margin: 20px 0;
  border: none;
  box-sizing: content-box;
  overflow: visible;

  :before {
    content: "";
    position: absolute;
    top: 50%;
    max-width: calc(50% - 25px);
    border-bottom: 1px solid #e5e5e5;
    height: 0.5px;
    right: calc(50% + 25px);
    width: 100%;
  }

  :after {
    content: "";
    position: absolute;
    top: 50%;
    max-width: calc(50% - 25px);
    border-bottom: 1px solid #e5e5e5;
    height: 0.5px;
    left: calc(50% + 25px);
    width: 100%;
  }
`;

export default () => <hr css={element} />;
