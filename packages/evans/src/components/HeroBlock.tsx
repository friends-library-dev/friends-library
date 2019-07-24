import React from 'react';
import { css } from '@emotion/core';
import Block from './Block';
import { Theme } from '@friends-library/ui';

export default () => (
  <Block
    css={(theme: Theme) => css`
      color: #fff;
      background: #444;
      background-size: cover;
      position: relative;

      :after {
        content: '';
        position: absolute;
        background: ${theme.primary.rgba(0.45)};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
      }

      h1 {
        margin: 8px 0 0;
        font-size: 23px;
        font-weight: 400;
        line-height: 1.2em;
        text-align: center;
        position: relative;
        color: #fff;
        z-index: 2;
      }

      p {
        color: #fff;
        background: ${theme.black.hex};
        padding: 10px;
        border-radius: 10px;
        margin: 20px 0 10px;
      }

      .Lead {
        font-size: 1.14rem;
      }
    `}
  >
    <h1>Dedicated to the preservation and free distribution of early Quaker writings</h1>

    <p className="Lead">
      This website exists to freely share the writings of early members of the Religious
      Society of Friends (Quakers), believing that no other collection of Christian
      writings more accurately communicates or powerfully illustrates the
      soul-transforming power of the gospel of Jesus Christ.
    </p>

    <p>
      Our 113 books are available for free download in multiple editions and digital
      formats, and a growing number of them are also recorded as audiobooks. Or, if you
      prefer, order a paperback &mdash; you pay only and exactly what it costs us to have
      them printed and shipped to you.
    </p>
  </Block>
);
