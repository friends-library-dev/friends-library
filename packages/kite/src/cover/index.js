// @flow
import fs from 'fs-extra';
import path from 'path';
import type { PrintSize } from '../type';
import { PUBLISH_DIR, toCss } from '../publish/file';
import { prince } from '../publish/pdf/prince';
import { getBookSize } from '../publish/book-sizes';


export default function cover(argv: Object): void {
  const pages = +argv.pages || 100;
  const sizeName = argv.size || 'Digest';
  const size = getBookSize(argv.size || 'm');
  if (!size) {
    throw new Error(`Invalid book size ${sizeName}`);
  }

  makeCover(
    'The Work of Vital Religion in the Soul',
    'Samuel Rundell',
    // 'The Original and Present State of Man',
    // 'Joseph Phipps',
    pages,
    size,
    !!argv.guides,
  );
}

export function makeCover(
  title: string,
  author: string,
  pages: number,
  size: PrintSize,
  withGuides: boolean,
) {
  fs.removeSync(PUBLISH_DIR);
  fs.ensureDir(PUBLISH_DIR);

  const isbn = '978-1-64476-001-7';

  const manifest = {
    'doc.html': getHtml(title, author, pages, size, withGuides),
    'doc.css': getCss(pages, size),
    'isbn.png': fs.readFileSync(path.resolve(__dirname, '..', `isbn/imgs/${isbn}.png`)),
  };

  const dir = '__cover__';
  return prince(manifest, dir, 'cover.pdf', process.argv.includes('--open'));
}

function getHtml(
  title: string,
  author: string,
  pages: number,
  size: PrintSize,
  withGuides: boolean,
) {
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
    <h3 class="publisher">Friends Library Publishing</h3>
    <div class="dimensions">
      <code>Width: ${dims['cover-width']}</code>
      <code>Height: ${dims['cover-height']}</code>
      <code> Pages: ${pages}</code>
    </div>
    <p class="blurb">
      “Do you believe in Christ,
in reference to His spiritual appearance in your own soul?
Have you, in the metaphorical language of Scripture,
opened the door of your heart unto Him, when,
by the secret convictions of His holy Light or Spirit,
He has knocked there for admission?
Have you in this way received Christ to be your leader,
your baptizer,
your high-priest and your king?
Has it become your daily concern to obey Him in all things,
avoiding in every part of your conduct and conversation
that which the light manifests to be evil,
denying yourself and taking up the cross
in respect to every pursuit and gratification which this divine Monitor does not allow,
however earnestly pleaded for by your natural inclination and desires?
And finally, do you witness,
through submission to the baptizing operation of His Holy Spirit,
the work of regeneration begun, and gradually progressing in your soul?”
<p>
  </body>
</html>`
    .trim();
}

function getCss(pages: number, size: PrintSize) {
  const css = toCss('../cover/cover.scss', getDims(pages, size));
  return css;
}

function getDims(pages: number, size: PrintSize): {[string]: string} {
  // For Perfect Softcovers: (#PGS / 444) + 0.06” = Spine Width
  const pageWidth = size.dims.width;
  const pageHeight = size.dims.height;
  const spinePad = 0.06;
  const coverPad = 0.25;
  const pagesPerInch = 444;
  const spineWidth = spinePad + (pages / pagesPerInch);
  return {
    fold: '0.062in',
    trim: '0.125in',
    safety: '0.250in',
    'page-width': `${pageWidth}in`,
    'page-height': `${pageHeight}in`,
    'spine-width': `${spineWidth}in`,
    'cover-width': `${(pageWidth * 2) + spineWidth + coverPad}in`,
    'cover-height': `${pageHeight + coverPad}in`,
  };
}
