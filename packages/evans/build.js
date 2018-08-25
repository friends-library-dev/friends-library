import * as React from 'react';
import fs from 'fs-extra';
import { basename } from 'path';
import { sync as glob } from 'glob';
import { LANG } from 'env';
import { wrap, getFriend } from 'server/helpers';
import routes from 'server/routes';
import App from 'components/App';
import { setLocale } from 'lib/i18n';

setLocale();

function generateRoute(props, children, path) {
  const html = wrap(<App {...props}>{children}</App>);
  fs.outputFile(`build/${path}.html`, html);
}

fs.ensureDir('build');
fs.copySync('static', 'build');
fs.moveSync('build/js/bundle.min.js', 'build/js/bundle.js', { overwrite: true });

Object.keys(routes).map(route => {
  if (route.indexOf('/:') !== -1) {
    return;
  }
  const { props, children } = routes[route]();
  const path = route === '/' ? '/index' : route;
  generateRoute(props, children, path);
});

const friends = glob(`./node_modules/@friends-library/friends/src/${LANG}/*.yml`);
friends.forEach(friendPath => {
  const slug = basename(friendPath, '.yml');
  const req = { params: { slug } };
  const { props, children } = routes['/friend/:slug'](req);
  const path = `friend/${slug}`;
  generateRoute(props, children, path);

  const friend = getFriend(slug);
  friend.documents.forEach(document => {
    const req = { params: { friendSlug: slug, docSlug: document.slug } };
    const { props, children } = routes['/:friendSlug/:docSlug'](req);
    const path = `${slug}/${document.slug}`;
    generateRoute(props, children, path);

    document.editions.forEach(edition => {
      const formats = edition.formats.map(f => f.type);
      formats.forEach((format) => {
        if (!['audio', 'softcover'].includes(format)) {
          return;
        }

        const req = { params: {
          friendSlug: slug,
          docSlug: document.slug,
          editionType: edition.type
        } };
        const { props, children } = routes[`/:friendSlug/:docSlug/:editionType/${format}`](req);
        const path = `${slug}/${document.slug}/${edition.type}/${format}`;
        generateRoute(props, children, path);
      });
    });
  });
});
