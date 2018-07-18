// @flow
import type { SourceSpec, XML, FileManifest } from '../type';
import { packageDocument } from './package-document';
export { make as makeEpub } from './make';


export function epub(spec: SourceSpec): FileManifest {
  return {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    'OEBPS/package-document.opf': packageDocument(spec),
    'OEBPS/lol.xhtml': spec.html,
    'OEBPS/nav.xhtml': getNav(spec),
  };
}

function getNav(spec: SourceSpec): string {
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
      <li><a href="lol.xhtml">LOL whole file, TODO...</a></li>
    </ol>
  </nav>
</body>
</html>
  `.trim();
}


function container(): XML {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
  `.trim();
}
