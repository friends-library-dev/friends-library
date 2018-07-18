// @flow
import type { SourceSpec, XML } from '../type';

export function packageDocument(spec: SourceSpec): XML {
  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:language id="pub-language">${spec.lang}</dc:language>
    <dc:identifier id="pub-id">${Date.now()}</dc:identifier>
    <dc:title id="pub-title">${spec.document.title}</dc:title>
    <dc:creator id="creator">${spec.friend.name}</dc:creator>
    <dc:publisher>The Friends Library</dc:publisher>
    <dc:subject>Quakers</dc:subject>
    <dc:subject>Religious Society of Friends</dc:subject>
    <dc:rights>Public domain in the USA.</dc:rights>
    <meta property="dcterms:modified">2018-07-17T14:42:14Z</meta>
  </metadata>
  <manifest>
    <item href="lol.xhtml" media-type="application/xhtml+xml" id="item1"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  </manifest>
  <spine>
    <itemref idref="item1"/>
  </spine>
</package>
  `.trim();
}
