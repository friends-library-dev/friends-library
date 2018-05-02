// @flow
import * as React from 'react';
import ReactDOM from 'react-dom/server';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { renderStaticOptimized } from 'glamor/server';
import { minify, stripDataSelectors, format, appCss } from 'lib/css';
import { Friend, Document, Edition, friendFromJS } from 'classes';
import { NODE_ENV, LANG } from 'env';

type Slug = string;
type Html = string;

export function getFriend(slug: Slug): Friend {
  const path = `./node_modules/@friends-library/friends/src/${LANG}/${slug}.yml`;
  const file = readFileSync(path);
  const data: Object = safeLoad(file);
  return friendFromJS(data);
}

export function query(
  friendSlug: Slug,
  docSlug: ?Slug = null,
  editionType: ?Slug = null,
): {|
  friend: Friend,
  document: Document,
  edition: Edition,
|} {
  const friend = getFriend(friendSlug);
  const result = {
    friend,
    document: new Document(),
    edition: new Edition(),
  };

  if (docSlug) {
    const { documents } = friend;
    const document: Document = documents.find(d => d.slug === docSlug) || new Document();
    result.document = document;
  }

  if (editionType && result.document) {
    const { document: { editions } } = result;
    const edition: Edition = editions.find(e => e.type === editionType) || new Edition();
    result.edition = edition;
  }

  return result;
}

export const wrap = (Component: React.Element<*>): Html => {
  const { html, css: glamorCss } = renderStaticOptimized(() => {
    return ReactDOM.renderToStaticMarkup(Component);
  });

  let markup = `<!doctype html>${html}`;
  const css = `${minify(appCss())}${stripDataSelectors(glamorCss)}`;
  markup = markup.replace('</head>', `<style>${format(css)}</style></head>`);

  if (NODE_ENV === 'development') {
    const bsPort = LANG === 'en' ? '2223' : '2225';
    const bsUri = `http://localhost:${bsPort}/browser-sync/browser-sync-client.js?v=2.23.3`;
    markup = markup.replace(
      '</body>',
      `<script async src="${bsUri}"></script></body>`,
    );
  }

  return markup;
};
