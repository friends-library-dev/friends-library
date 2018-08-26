// @flow
import * as React from 'react';
import ReactDOM from 'react-dom/server';
import { renderStaticOptimized } from 'glamor/server';
import { minify, stripDataSelectors, format, appCss } from '../lib/css';
import { NODE_ENV, LANG } from '../env';
import type { Html } from '../type';


export const wrap = (Component: React.Element<*>): Html => {
  const { html, css: glamorCss } = renderStaticOptimized(() => {
    return ReactDOM.renderToStaticMarkup(Component);
  });

  let markup = `<!doctype html>${html}`;

  markup = markup.replace(/<(\/)?fragment-wrapper>/, '');

  const css = `${minify(appCss())}${stripDataSelectors(glamorCss)}`;
  markup = markup.replace('</head>', `<style>${format(css)}</style></head>`);

  if (NODE_ENV === 'development') {
    const bsPort = LANG === 'en' ? '2223' : '2225';
    const bsUri = `http://localhost:${bsPort}/browser-sync/browser-sync-client.js?v=2.24.1`;
    markup = markup.replace(
      '</body>',
      `<script async src="${bsUri}"></script></body>`,
    );
  }

  return markup;
};
