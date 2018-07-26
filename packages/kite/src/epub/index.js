// @flow
import type { SourceSpec, Xml, Html, FileManifest, DocSection } from '../type';
import { packageDocument } from './package-document';
import { divide } from '../publish/divide';

export { make as makeEpub } from './make';


export function epub(spec: SourceSpec): FileManifest {
  const sections = divide(spec.html);
  return {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    'OEBPS/package-document.opf': packageDocument(spec, sections),
    'OEBPS/nav.xhtml': getNav(spec, sections),
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
  </head>
  <body>
    ${html}
  </body>
</html>`
  .trim()
  .replace(/<hr>/gm, '<hr />')
  .replace(/<br>/gm, '<br />');
}

function getNav(spec: SourceSpec, sections: Array<DocSection>): Html {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${spec.document.title}</title>
</head>
<body>
  <h1>${spec.document.title}</h1>
  <nav epub:type="toc" id="toc">
    <h2>Table of Contents</h2>
    <ol>
      ${sections.filter(s => s.id !== 'notes').map(sect =>
        `<li><a href="${sect.id}.xhtml">${sect.title || ''}</a></li>`
      ).join('\n      ')}
    </ol>
  </nav>
</body>
</html>
  `.trim();
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
