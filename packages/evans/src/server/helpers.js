// @flow
import * as React from 'react';
import ReactDOM from 'react-dom/server';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import friendFromJS from '../classes/map';
import { renderStaticOptimized } from 'glamor/server';
import { minify, stripDataSelectors, format, appCss } from '../lib/css';
import Friend from '../classes/Friend';

const { env: { NODE_ENV, PORT } } = process;


export function getFriend(slug: string): Friend {
  const path = `./node_modules/@friends-library/friends/src/en/${slug}.yml`;
  const file = readFileSync(path);
  const data: Object = safeLoad(file);
  return friendFromJS(data);
}


export const wrap = (Component: React.Element<*>): string => {
  const { html, css: glamorCss } = renderStaticOptimized(() => {
    return ReactDOM.renderToStaticMarkup(Component);
  });

  let markup = `<!doctype html>${html}`;
  const css = `${minify(appCss())}${stripDataSelectors(glamorCss)}`;
  markup = markup.replace('</head>', `<style>${format(css)}</style></head>`);

  if (NODE_ENV === 'development') {
    const bsUri = 'http://localhost:2223/browser-sync/browser-sync-client.js?v=2.23.3';
    markup = markup.replace(
      '</body>',
      `<script async src="${bsUri}"></script></body>`,
    );
  }

  return markup;
}
