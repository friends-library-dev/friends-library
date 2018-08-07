// @flow
import type { SourceSpec, Xml, Html, FileManifest, DocSection, Command, Css } from '../type';
import fs from 'fs-extra';
import { mapValues, mapKeys } from 'lodash';
import { packageDocument } from './package-document';
import { divide } from '../publish/divide';
import { toc } from './toc';
import { frontmatter } from './frontmatter';
export { make as makeEpub } from './make';

const baseStyles = fs.readFileSync('src/epub/css/style.css').toString();
const kf8Styles = fs.readFileSync('src/epub/css/kf8.css').toString();
const epubStyles = fs.readFileSync('src/epub/css/epub.css').toString();

export const M7BR = '{{{ MOBI7_BR }}}';

export function epub(spec: SourceSpec, cmd: Command): FileManifest {
  const sections = divide(spec);
  const frontMatter = frontmatter(spec);
  const manifest = {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    'OEBPS/style.css': css(spec),
    'OEBPS/package-document.opf': packageDocument(spec, sections, cmd),
    'OEBPS/nav.xhtml': toc(spec, sections),
    ...mapValues(mapKeys(frontMatter, (v, k) => `OEBPS/${k}.xhtml`), wrapHtml),
    ...sectionize(sections),
  };

  return Object.keys(manifest).reduce((acc, key) => {
    const val = manifest[key];
    if (key.match(/\.xhtml$/)) {
      const isMobi = spec.target === 'mobi';
      acc[key] = val.replace(/{{{ MOBI7_BR }}}/gm, isMobi ? '<br class="m7"/>' : '');
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
}

function css(spec: SourceSpec): Css {
  let css = baseStyles;
  if (spec.target === 'mobi') {
    css += `\n\n@media amzn-kf8 {\n${kf8Styles}\n}`;
  } else {
    css += `\n\n${epubStyles}`;
  }
  return css;
}

function sectionize(sections: Array<DocSection>): { [string]: Html } {
  return sections.reduce((acc, { id, html }) => {
    return {
      ...acc,
      [`OEBPS/${id}.xhtml`]: wrapHtml(html),
    };
  }, {});
}

export function wrapHtml(html: string): string {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
  <head>
    <meta charset="UTF-8"/>
    <link href="style.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>
    ${html}
  </body>
</html>`
  .trim()
  .replace(/<hr>/gm, '<hr />')
  .replace(/<br>/gm, '<br />');
}


function container(): Xml {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package-document.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
  `.trim();
}
