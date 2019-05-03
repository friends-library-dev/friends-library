import { exec } from 'child_process';
import stripIndent from 'strip-indent';
import { Html, FilePath, CoverProps } from '@friends-library/types';
import { Cover, coverCss, coverAsset } from '@friends-library/cover';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { prince } from '../../publish/pdf/prince';

export default async function cover(): Promise<void> {
  const props: CoverProps = {
    title: 'Test Title',
    author: 'Test Author',
    blurb: 'TODO',
    pages: 444,
    printSize: 'm',
    edition: 'modernized',
    showGuides: false,
  };
  const filePath = await coverFromProps(props);
  exec(`open "${filePath}"`);
}

export async function coverFromProps(props: CoverProps): Promise<FilePath> {
  const el = React.createElement(Cover, props);
  const html = ReactDOMServer.renderToStaticMarkup(el);
  const isbnPath = `images/isbn/${props.isbn}.png`;
  const manifest = {
    'doc.html': wrapHtml(html, props),
    'doc.css': coverCss(props),
    ...(props.isbn ? { [isbnPath]: coverAsset(isbnPath) } : {}),
  };
  const { filePath } = await prince(
    manifest,
    '__cover__',
    `cover-${new Date().getTime() / 1000}.pdf`,
  );
  return filePath;
}

function wrapHtml(inner: Html, props: any): Html {
  return stripIndent(`
    <!DOCTYPE html>
    <html lang="en" class="pdf trim--${props.printSize}">
      <head>
        <meta charset="UTF-8"/>
        <link href="doc.css" rel="stylesheet" type="text/css"/>
      </head>
      <body>
        ${inner.replace(/src="\/images\//g, 'src="images/')}
      </body>
    </html>
  `).trim();
}
