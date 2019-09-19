import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FileManifest } from '@friends-library/types';
import { CoverFront } from '@friends-library/ui';
import wrapBodyHtml from '../wrap-html';

export default function cover() {
  // @TODO
}

export async function coverFromProps(): Promise<FileManifest[]> {
  const el = React.createElement(CoverFront, {
    firstInitial: 'S',
    lastInitial: 'R',
    author: 'Samuel Rundell',
    title: 'The Work of Vital Religion in the Soul',
    lang: 'en',
    fragments: {},
  });
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return [
    {
      'doc.html': wrapBodyHtml(html, {
        isUtf8: true,
        css: ['doc.css'],
        htmlAttrs: 'lang="en" class="pdf trim--m"',
      }),
      'doc.css': '',
    },
  ];
}
