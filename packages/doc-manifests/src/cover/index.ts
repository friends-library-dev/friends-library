import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FileManifest } from '@friends-library/types';
import {
  Front,
  staticCss,
  pdfCss,
  scalingCss,
  docCss,
} from '@friends-library/cover-component';
import wrapBodyHtml from '../wrap-html';

export default function cover() {
  // @TODO
}

export async function coverFromProps(): Promise<FileManifest[]> {
  const el = React.createElement(Front, {
    author: 'Samuel Rundell',
    title: 'The Work of Vital Religion in the Soul',
    lang: 'en',
    edition: 'updated',
    showGuides: false,
    customCss: '',
    customHtml: '',
    size: 'm',
    pages: 222,
    blurb: 'no blurb, no bueno',
  });
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return [
    {
      'doc.html': wrapBodyHtml(html, {
        isUtf8: true,
        css: ['doc.css'],
        htmlAttrs: 'lang="en" class="pdf trim--m"',
      }),
      'doc.css': `
        ${staticCss()}
        ${pdfCss()}
        ${scalingCss()}
        ${docCss()}
      `,
    },
  ];
}
