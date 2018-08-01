// @flow
import type { SourceSpec, Xml, Html, FileManifest, DocSection, Command } from '../type';
import fs from 'fs-extra';
import { packageDocument } from './package-document';
import { divide } from '../publish/divide';
import { toc } from './toc';
import { frontmatter } from './frontmatter';
export { make as makeEpub } from './make';

const baseStyles = fs.readFileSync('src/epub/style.css').toString();

export function epub(spec: SourceSpec, cmd: Command): FileManifest {
  const sections = divide(spec.html, spec.config);
  return {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    'OEBPS/style.css': baseStyles,
    'OEBPS/package-document.opf': packageDocument(spec, sections, cmd),
    'OEBPS/nav.xhtml': toc(spec, sections),
    'OEBPS/frontmatter.xhtml': wrapHtml(frontmatter(spec)),
    ...sectionize(sections),
  };
}

function sectionize(sections: Array<DocSection>): { [string]: Html } {
  return sections.reduce((acc, { id, html }) => {
    return {
      ...acc,
      [`OEBPS/${id}.xhtml`]: wrapHtml(html),
    };
  }, {});
}

function wrapHtml(html: string): string {
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
