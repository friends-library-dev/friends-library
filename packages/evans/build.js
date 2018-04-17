import * as React from 'react';
import fs from 'fs-extra';
import { basename } from 'path';
import { sync as glob } from 'glob';
import { wrap, getFriend } from './src/server/helpers';
import routes from './src/server/routes';
import App from './src/components/App';

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

const friends = glob('./node_modules/@friends-library/friends/src/en/*.yml');
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
      if (!edition.audio) {
        return;
      }

      const req = { params: {
        friendSlug: slug,
        docSlug: document.slug,
        editionType: edition.type
      } };
      const { props, children } = routes['/:friendSlug/:docSlug/:editionType/audio'](req);
      const path = `${slug}/${document.slug}/${edition.type}/audio`;
      generateRoute(props, children, path);
    });
  });
});
