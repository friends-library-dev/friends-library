// @flow
import moment from 'moment';
import type { SourceSpec, DocSection, Xml, Command } from '../type';
import { frontmatter } from './frontmatter';

export function packageDocument(
  spec: SourceSpec,
  sections: Array<DocSection>,
  { perform }: Command
): Xml {
  const { lang, friend, document, edition, date } = spec;
  const modified = moment.utc(moment.unix(date)).format('YYYY-MM-DDThh:mm:ss[Z]');
  const uuid = `friends-library/epub/${lang}/${friend.slug}/${document.slug}/${edition.type}`;
  const randomizer = ` (${moment().format('h:mm:ss')})`;
  const chunks = Object.keys(frontmatter(spec)).concat(sections.map(({ id }) => id));
  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:language id="pub-language">${lang}</dc:language>
    <dc:identifier id="pub-id">${perform ? uuid : Date.now()}</dc:identifier>
    <dc:title id="pub-title">${document.title}${perform ? '' : randomizer}</dc:title>
    <dc:creator id="author">${friend.name}</dc:creator>
    <dc:publisher>The Friends Library</dc:publisher>
    <dc:subject>Quakers</dc:subject>
    <dc:subject>Religious Society of Friends</dc:subject>
    <dc:rights>Public domain in the USA.</dc:rights>
    <meta property="file-as" refines="#author">${friend.alphabeticalName()}</meta>
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>
  <manifest>
    ${chunks.map(id => (
      `<item href="${id}.xhtml" media-type="application/xhtml+xml" id="${id}"/>`
    )).join('\n')}
    <item href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" id="nav"/>
    <item href="style.css" id="css" media-type="text/css"/>
  </manifest>
  <spine>
    ${chunks.map(id => `<itemref idref="${id}"/>`).join('\n')}
  </spine>
</package>
  `.trim();
}
