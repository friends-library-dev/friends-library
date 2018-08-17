// @flow
import moment from 'moment';
import type { Job, Xml } from '../../type';
import { frontmatter } from './frontmatter';

export function packageDocument(job: Job): Xml {
  const { id: jobId, spec, cmd: { perform } } = job;
  const { meta, revision: { timestamp } } = spec;
  const { author: { name, nameSort }, title } = meta;
  const modified = moment.utc(moment.unix(timestamp)).format('YYYY-MM-DDThh:mm:ss[Z]');
  const randomizer = ` (${moment().format('h:mm:ss')})`;

  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:language id="pub-language">${spec.lang}</dc:language>
  <dc:identifier id="pub-id">friends-library/${perform ? jobId : Date.now()}</dc:identifier>
  <dc:title id="pub-title">${title}${perform ? '' : randomizer}</dc:title>
  <dc:creator id="author">${name}</dc:creator>
  <dc:publisher>The Friends Library</dc:publisher>
  <dc:subject>Quakers</dc:subject>
  <dc:subject>Religious Society of Friends</dc:subject>
  <dc:rights>Public domain in the USA.</dc:rights>
  <meta property="file-as" refines="#author">${nameSort}</meta>
  <meta property="dcterms:modified">${modified}</meta>
</metadata>
<manifest>
  ${[...manifestItems(job)].map(([id, data]) => `<item id="${id}" ${attrs(data)}/>`).join('\n  ')}
</manifest>
<spine>
  ${spineItems(job).map(id => `<itemref idref="${id}"/>`).join('\n  ')}
</spine>
</package>
`.trim();
}

function attrs(data: Object): string {
  return Object.entries(data).reduce((acc, [key, val]) => {
    acc.push(`${key}="${String(val)}"`);
    return acc;
  }, []).join(' ');
}

export function manifestItems(job: Job): Map<string, Object> {
  const { spec: { sections, notes } } = job;
  const items = new Map();

  items.set('css', {
    href: 'style.css',
    'media-type': 'text/css',
  });

  items.set('nav', {
    href: 'nav.xhtml',
    'media-type': 'application/xhtml+xml',
    properties: 'nav',
  });

  sections.forEach(({ id }) => {
    items.set(id, {
      href: `${id}.xhtml`,
      'media-type': 'application/xhtml+xml',
    });
  });

  if (notes.size) {
    items.set('notes', {
      href: 'notes.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  }

  Object.keys(frontmatter(job)).forEach(slug => items.set(slug, {
    href: `${slug}.xhtml`,
    'media-type': 'application/xhtml+xml',
  }));

  return items;
}

export function spineItems(job: Job): Array<string> {
  const { spec: { sections, notes } } = job;
  let items = Object.keys(frontmatter(job));
  items = items.concat(sections.map(section => section.id));

  if (notes.size) {
    items.push('notes');
  }
  return items;
}
