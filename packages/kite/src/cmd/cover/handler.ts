import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import stripIndent from 'strip-indent';
import { Arguments } from 'yargs';
import { PrintSize, Css, Html, FilePath } from '@friends-library/types';
import { Cover, coverCss, coverAsset } from '@friends-library/cover';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PUBLISH_DIR, toCss } from '../../publish/file';
import { prince } from '../../publish/pdf/prince';

interface CoverOptions {
  pages: number;
  printSize: string;
  guides: boolean;
  open: boolean;
}

export default async function cover(opts: Arguments<CoverOptions>): Promise<void> {
  const props = { title: 'Foo', author: 'bar' };
  const filePath = await coverFromProps(props);
  exec(`open "${filePath}"`);
}

export async function coverFromProps(props: any): Promise<FilePath> {
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

export async function makeCover(
  title: string,
  author: string,
  size: PrintSize,
  opts: CoverOptions,
): Promise<void> {
  fs.removeSync(PUBLISH_DIR);
  fs.ensureDir(PUBLISH_DIR);

  const isbn = '978-1-64476-000-0';

  const manifest = {
    'doc.html': getHtml(title, author, opts.pages, size, opts.guides),
    'doc.css': getCss(opts.pages, size),
    'isbn.png': fs
      .readFileSync(path.resolve(__dirname, '..', '..', `isbn/imgs/${isbn}.png`))
      .toString(),
  };
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

function getHtml(
  title: string,
  author: string,
  pages: number,
  size: PrintSize,
  withGuides: boolean,
): Html {
  const dims = getDims(pages, size);
  return `
<!DOCTYPE html>
<html lang="en" class="size--${size.abbrev}">
  <head>
    <meta charset="UTF-8"/>
    <link href="doc.css" rel="stylesheet" type="text/css"/>
  </head>
  <body class="${withGuides ? 'guides' : ''}">
    <div class="trim trim--l"></div>
    <div class="trim trim--r"></div>
    <div class="trim trim--t"></div>
    <div class="trim trim--b"></div>
    <div class="safety safety--l"></div>
    <div class="safety safety--r"></div>
    <div class="safety safety--t"></div>
    <div class="safety safety--b"></div>
    <div class="safety safety--spine"></div>
    <img id="isbn" src="isbn.png" />
    <h1 class="title">${title}</h1>
    ${pages > 135 ? `<h1 class="spine-title">${title}</h1>` : ''}
    <h2 class="author">${author}</h2>
    ${pages > 135 ? `<h2 class="spine-author">${author}</h2>` : ''}
    <div class="dimensions">
      <code>Width: ${dims['cover-width']}</code>
      <code>Height: ${dims['cover-height']}</code>
      <code> Pages: ${pages}</code>
    </div>
  </body>
</html>`.trim();
}

function getCss(pages: number, size: PrintSize): Css {
  const css = toCss('../cmd/cover/cover.scss', getDims(pages, size));
  return css;
}

function getDims(pages: number, size: PrintSize): { [k: string]: string } {
  // For Perfect Softcovers: (#PGS / 444) + 0.06” = Spine Width
  const pageWidth = size.dims.width;
  const pageHeight = size.dims.height;
  const spinePad = 0.06;
  const coverPad = 0.25;
  const pagesPerInch = 444;
  const spineWidth = spinePad + pages / pagesPerInch;
  return {
    fold: '0.062in',
    trim: '0.125in',
    safety: '0.250in',
    'page-width': `${pageWidth}in`,
    'page-height': `${pageHeight}in`,
    'spine-width': `${spineWidth}in`,
    'cover-width': `${pageWidth * 2 + spineWidth + coverPad}in`,
    'cover-height': `${pageHeight + coverPad}in`,
  };
}
