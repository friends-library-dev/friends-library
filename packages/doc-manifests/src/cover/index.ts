import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FileManifest, CoverProps } from '@friends-library/types';
import { PrintPdf, css } from '@friends-library/cover-component';
import wrapBodyHtml from '../wrap-html';

export default function cover() {
  // @TODO
}

export async function coverFromProps(): Promise<FileManifest[]> {
  const props: CoverProps = {
    author: 'Samuel Rundell',
    title: 'The Work of Vital Religion in the Soul',
    lang: 'en',
    edition: 'updated',
    showGuides: false,
    customCss: '',
    customHtml: '',
    size: 'm',
    pages: 222,
    blurb:
      'Samuel Rundell (1762 - 1848) was a wool-dealer who lived in Liskeard, a small town in southwest England. When young he befriended that worthy elder and "mother in Israel" Catherine Payton (Phillips), whose wisdom and piety no doubt made lasting impressions upon him. As a minister and author, Rundell was particularly concerned to press the necessity of a real and living experience of inward purification by an unreserved obedience to the light or Spirit of Christ working in the heart.',
  };
  const el = React.createElement(PrintPdf, props);
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return [
    {
      'doc.html': wrapBodyHtml(html, {
        isUtf8: true,
        css: ['doc.css'],
        htmlAttrs: 'lang="en" class="prince pdf trim--m"',
      }),
      'doc.css': `
        ${css.common(props).join('\n')}
        ${css.back(props).join('\n')}
        ${css.spine(props).join('\n')}
        ${css.front(props).join('\n')}
        ${css.pdf(props).join('\n')}
      `,
    },
  ];
}
