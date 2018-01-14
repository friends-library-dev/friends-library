// @flow
import * as React from 'react';
import fs from 'fs-extra';
import ReactDOM from 'react-dom/server';
import { renderStaticOptimized } from 'glamor/server';
import CleanCSS from 'clean-css';

const { env: { NODE_ENV, PORT } } = process;

const appCss = fs.readFileSync('src/components/App.css', 'utf8');

function minify(css: string): string {
  return new CleanCSS().minify(css).styles;
}

function stripDataSelectors(css: string): string {
  return css.replace(/,\[data-css-[^{]+{/g, '{');
}

export const wrap = (Component: React.Element<*>): string => {
  const { html, css: glamorCss } = renderStaticOptimized(() => {
    return ReactDOM.renderToStaticMarkup(Component);
  });

  let markup = `<!doctype html>${html}`;
  const css = `${minify(appCss)}${stripDataSelectors(glamorCss)}`;
  markup = markup.replace('</head>', `<style>${css}</style></head>`);

  if (NODE_ENV === 'development') {
    const bsUri = 'http://localhost:2223/browser-sync/browser-sync-client.js?v=2.23.3';
    markup = markup.replace(
      '</body>',
      `<script async src="${bsUri}"></script></body>`,
    );
  }

  return markup;
}
