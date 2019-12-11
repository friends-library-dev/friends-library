import moment from 'moment';
import { Xml, DocPrecursor, EbookConfig } from '@friends-library/types';
import ebookFrontmatter from './frontmatter';

export function packageDocument(dpc: DocPrecursor, conf: EbookConfig): Xml {
  const {
    lang,
    isCompilation,
    revision: { timestamp },
    meta: {
      author: { name, nameSort },
      title,
    },
  } = dpc;
  const modified = moment.utc(moment.unix(timestamp)).format('YYYY-MM-DDThh:mm:ss[Z]');
  const randomize = conf.randomizeForLocalTesting;
  const randomizer = ` (${moment().format('h:mm:ss')})`;
  const publisher =
    lang === 'en' ? 'The Friends Library' : 'La Biblioteca de los Amigios';

  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:language id="pub-language">${lang}</dc:language>
  <dc:identifier id="pub-id">friends-library/${
    randomize ? Date.now() : `${dpc.documentId}/${dpc.editionType}`
  }</dc:identifier>
  <dc:title id="pub-title">${title}${randomize ? '' : randomizer}</dc:title>
  <dc:creator id="author">${isCompilation ? publisher : name}</dc:creator>
  <dc:publisher>${publisher}</dc:publisher>
  <dc:subject>Quakers</dc:subject>
  <dc:subject>Religious Society of Friends</dc:subject>
  <dc:rights>Public domain in the USA.</dc:rights>
  ${isCompilation ? '' : `<meta property="file-as" refines="#author">${nameSort}</meta>`}
  <meta property="dcterms:modified">${modified}</meta>
  ${conf.coverImg ? '<meta name="cover" content="cover-img" />' : ''}
</metadata>
<manifest>
  ${[...manifestItems(dpc, conf)]
    .map(([id, data]) => `<item id="${id}" ${attrs(data)}/>`)
    .join('\n  ')}
</manifest>
<spine>
  ${spineItems(dpc, conf)
    .map(id => `<itemref idref="${id}"/>`)
    .join('\n  ')}
</spine>
</package>
`.trim();
}

function attrs(data: Record<string, any>): string {
  return Object.entries(data)
    .reduce((acc, [key, val]) => {
      acc.push(`${key}="${String(val)}"`);
      return acc;
    }, [] as string[])
    .join(' ');
}

interface Item {
  href: string;
  'media-type': 'text/css' | 'application/xhtml+xml' | 'image/png' | 'image/jpeg';
  properties?: string;
}

export function manifestItems(dpc: DocPrecursor, conf: EbookConfig): Map<string, Item> {
  const { sections, notes } = dpc;
  const items = new Map<string, Item>();

  items.set('css', {
    href: 'style.css',
    'media-type': 'text/css',
  });

  if (conf.coverImg) {
    items.set('cover-img', {
      href: 'cover.png',
      'media-type': 'image/png',
      properties: 'cover-image',
    });

    items.set('cover', {
      href: 'cover.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  }

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

  Object.keys(ebookFrontmatter(dpc, conf.subType)).forEach(slug =>
    items.set(slug, {
      href: `${slug}.xhtml`,
      'media-type': 'application/xhtml+xml',
    }),
  );

  return items;
}

export function spineItems(dpc: DocPrecursor, conf: EbookConfig): string[] {
  const { sections, notes } = dpc;
  let items = Object.keys(ebookFrontmatter(dpc, conf.subType));
  items = items.concat(sections.map(section => section.id));

  if (notes.size) {
    items.push('notes');
  }

  if (conf.coverImg) {
    items.unshift('cover');
  }

  return items;
}
