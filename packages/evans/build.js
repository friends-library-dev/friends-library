import * as React from 'react';
import fs from 'fs-extra';
import { basename } from 'path';
import { sync as glob } from 'glob';
import { t } from 'c-3po';
import { LANG } from 'env';
import { wrap } from 'server/helpers';
import { podcast } from 'lib/xml';
import routes from 'server/routes';
import App from 'components/App';
import { getAllFriends } from '@friends-library/friends';

function generateRoute(props, children, path) {
  const html = wrap(<App {...props}>{children}</App>);
  fs.outputFile(`build/${path}.``html`, html);
}

fs.ensureDir('build');
fs.copySync('static', 'build');
fs.moveSync('build/js/bundle.min.js', 'build/js/bundle.js', { overwrite: true });

Object.keys(routes).map(route => {
  if (route.indexOf('/:') !== -1) {
    return;
  }

  // temporary, until we have compilations in spanish
  if (route === '/compilations') {
    return;
  }

  const { props, children } = routes[route]({ params: {} });
  const path = route === '/' ? '/index' : route;
  generateRoute(props, children, path);
});

getAllFriends(LANG).forEach(friend => {
  const slug = friend.slug;
  const req = { params: { slug } };
  const { props, children } = routes['/friend/:slug'](req);
  let path = `friend/${slug}`;
  if (LANG === 'es') {
    path = friend.isMale() ? `/amigo/${slug}` : `/amiga/${slug}`;
  }

  generateRoute(props, children, path);

  friend.documents.forEach(document => {
    const req = { params: { friendSlug: slug, docSlug: document.slug } };
    const { props, children } = routes['/:friendSlug/:docSlug'](req);
    const path = `${slug}/${document.slug}`;
    generateRoute(props, children, path);

    document.editions.forEach(edition => {
      const formats = edition.formats.map(f => f.type);
      formats.forEach((format) => {
        if (!['audio', 'paperback'].includes(format)) {
          return;
        }

        const req = { params: {
          friendSlug: slug,
          docSlug: document.slug,
          editionType: edition.type,
        } };
        const { props, children } = routes[`/:friendSlug/:docSlug/:editionType/${format}`](req);
        const path = `${slug}/${document.slug}/${edition.type}/${format}`;
        generateRoute(props, children, path);

        if (format !== 'audio') {
          return;
        }

        const xmlPath = `${slug}/${document.slug}/${edition.type}/podcast`;
        const xml = podcast(document, edition);
        fs.outputFile(`build/${xmlPath}.rss`, xml);
      });
    });
  });
});
